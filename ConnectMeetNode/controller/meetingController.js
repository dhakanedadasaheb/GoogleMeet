import { sql } from "../config/db.js";

const generateMeetingId = () => {
    const chars ='abcdefghijklmnopqrstuvwxyz';
    const segment = (len)=> Array.from({length: len}, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `${segment(3)}-${segment(3)}-${segment(3)}`;

}


export const createMeeting = async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.user.id;

        const users = await sql` SELECT name FROM users WHERE id = ${userId}`;
        let meetingId = generateMeetingId();

        let existing = await sql`
            SELECT meeting_id FROM meetings
            WHERE meeting_id = ${meetingId} `;

        while (existing.length > 0) {
            meetingId = generateMeetingId();
            existing = await sql`
                SELECT meeting_id FROM meetings
                WHERE meeting_id = ${meetingId}`;
        }

        const [meeting] = await sql`
            INSERT INTO meetings (  meeting_id,  title, host_id, status)
            VALUES (${meetingId},${title || 'Instant Meeting'}, ${userId},'active')
            RETURNING id, meeting_id, title, host_id, status, created_at  `;

        const hostName = users[0]?.name || 'Host';

        await sql`
            INSERT INTO meeting_participants (meeting_id,user_id,name)
            VALUES (${meeting.id},${userId},${hostName} )`;

        return res.status(201).json({
            success: true,
            message: "Meeting created successfully",
            meeting: {
                id: meeting.id,
                meeting_id: meeting.meeting_id,
                title: meeting.title,
                host_id: meeting.host_id,
                status: meeting.status,
                created_at: meeting.created_at
            }
        });

    } catch (error) {
        console.error("Error getting user sessions:", error);
        return res.status(500).json({error: error.message});
    }
};



export const getMeeting = async(req,res) =>{
    try {
        const { meetingId } = req.params;
        const [meetings] = await sql`SELECT m.*, u.id as host_user_id, u.name as host_name, u.email as host_email from meetings m join users u on m.host_id = u.id where m.meeting_id = ${meetingId}`;

        if (meetings.length === 0) {
            return res.status(404).json({error: "Meeting not found"});
        }

        const meeting = meetings[0];
        if(meeting.stats === "ended"){
            return res.status(400).json({error: "Meeting has ended"});
        }

        return res.json({meeting: {
            id: meeting.id,
            meeting_id: meeting.meeting_id,
            title: meeting.title,
            status: meeting.status,
            created_at: meeting.created_at,
            host: {
                id: meeting.host_user_id,
                name: meeting.host_name,
                email: meeting.host_email
            }
        }});
    } catch (error) {
        console.error("Error getting user sessions:", error);
        return res.status(500).json({error: error.message});
    }
}


export const getUserSessions = async(req,res) =>{
    try {
        const userId = req.user.id;
        const meetings = await sql`
            SELECT DISTINCT
                m.id,
                m.meeting_id,
                m.title,
                m.status,
                m.created_at,
                m.ended_at,
                m.host_id,
                u.name AS host_name, u.email AS host_email
            FROM meetings m
            JOIN users u ON m.host_id = u.id
            LEFT JOIN meeting_participants mp
                ON m.id = mp.meeting_id
            WHERE
                m.host_id = ${userId}
                OR mp.user_id = ${userId}
            ORDER BY m.created_at DESC
        `;
        
        const formattedMeetings = await Promise.all(
            meetings.map(async(m)=>{
                const participant = await sql`select mp.*, u.email from meeting_participants mp left join users u on mp.user_id = u.id where mp.meeting_id = ${m.id}`;

                const messages = await sql`select id, sender_id, sender_name, text, timestamp from meeting_messages where meeting_id = ${m.id} order by timestamp asc`;

                return {
                    id: m.id,
                    meeting_id: m.meeting_id,
                    title: m.title,
                    status: m.status,
                    created_at: m.created_at,
                    ended_at: m.ended_at,
                    host: {
                        id: m.host_id,
                        name: m.host_name,
                        email: m.host_email
                    },
                    participants: participant.map(p => ({
                        user: p.user ? {id: p.user_id, email: p.email} : null,
                        name: p.name,
                        joined_at: p.joined_at,
                        left_at: p.left_at
                    })),
                    messages: messages.map((msg)=>({
                        id: msg.id,
                        sender_id: msg.sender_id,
                        senderName: msg.sender_name,
                        text: msg.text,
                        timestamp: msg.timestamp
                    }))
                }
        })
        )
        res.json({meetings: formattedMeetings});
    } catch (error) {
        console.error("Error getting user sessions:", error);
        return res.status(500).json({error: error.message});
    }
}


export const getSessionDetails = async(req,res) =>{
    try {
        const { id } = req.params;

        // Get meeting details
        const meetings = await sql`
            SELECT m.*, u.id as host_user_id, u.name as host_name, u.email as host_email from meetings m join users u on m.host_id = u.id where m.meeting_id = ${id}`;

        if (meetings.length === 0) {
            return res.status(404).json({
                error: "Session details not found"
            });
        }

        const m = meetings[0];

        const participants = await sql`select mp.*, u.email from meeting_participants mp left join users u on mp.user_id = u.id where mp.meeting_id = ${m.id}`;

        const messages = await sql`select id, sender_id, sender_name, text, timestamp from meeting_messages where meeting_id = ${m.id} order by timestamp asc`;

        const formattedMeeting = {
                    id: m.id,
                    meeting_id: m.meeting_id,
                    title: m.title,
                    status: m.status,
                    created_at: m.created_at,
                    ended_at: m.ended_at,
                    host: {
                        id: m.host_id,
                        name: m.host_name,
                        email: m.host_email
                    },
                    participants: participants.map(p => ({
                        user: p.user ? {id: p.user_id, email: p.email} : null,
                        name: p.name,
                        joined_at: p.joined_at,
                        left_at: p.left_at
                    })),
                    messages: messages.map((msg)=>({
                        id: msg.id,
                        sender_id: msg.sender_id,
                        senderName: msg.sender_name,
                        text: msg.text,
                        timestamp: msg.timestamp
                    }))
                }
                res.json({meeting: formattedMeeting});
    } catch (error) {
       console.error("Error getting user sessions:", error);
        return res.status(500).json({error: error.message});
    }
}


export const getMeetingStats = async(req,res) => {
    try {
        const userId = req.user.id;

        const monthlyCountRes = await sql`
            SELECT COUNT(*) AS count
            FROM meetings
            WHERE host_id = ${userId}
        `;

        const monthlyCount = parseInt(monthlyCountRes[0]?.count || '0', 10);

        return res.json({
            monthlyCount
        });

    } catch (error) {
        console.error("Error getting user sessions:", error);
        return res.status(500).json({ error: error.message });
    }
};
