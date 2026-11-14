
import { verifyWebhook } from '@clerk/express/webhooks';
import { sql } from '../config/db.js';

export const handleClerkWebhook = async (req, res) => {

    // 1. Check signing secret
    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!signingSecret) {
        console.error('CLERK_WEBHOOK_SIGNING_SECRET is missing!');

        return res.status(500).json({
            success: false,
            error: 'Webhook signing secret is not configured'
        });
    }

    // 2. Verify webhook signature
    let evt;

    try {
        evt = await verifyWebhook(req, {
            signingSecret
        });

        console.log('Webhook signature verified successfully!');

    } catch (error) {
        console.error('Webhook signature verification failed:', error.message);

        return res.status(400).json({
            success: false,
            error: 'Webhook verification failed'
        });
    }

    // 3. Get event information
    const eventType = evt.type;
    const data = evt.data;
    console.log('Clerk user data:', JSON.stringify(data, null, 2));

    console.log('Received Clerk event:', eventType);

    try {

        // Get primary email
        const primaryEmail =
            data.email_addresses?.find(
                email => email.id === data.primary_email_address_id
            )?.email_address
            || data.email_addresses?.[0]?.email_address
            || '';
        // Get user name
        const name =
            `${data.first_name || ''} ${data.last_name || ''}`.trim()
            || 'User';

        // Get profile image
        const image = data.image_url || '';

        // 4. Handle different events
        switch (eventType) {

            // USER CREATED
            case 'user.created': {

                const userId = data.id;

                if (!primaryEmail) {
                    console.error('Primary email missing:', userId);

                    return res.status(400).json({
                        success: false,
                        error: 'User primary email is missing'
                    });
                }

                await sql`
                    INSERT INTO users (
                        id,
                        name,
                        email,
                        image,
                        plan
                    )
                    VALUES (
                        ${userId},
                        ${name},
                        ${primaryEmail},
                        ${image},
                        'free'
                    )
                    ON CONFLICT (id)
                    DO UPDATE SET
                        name = EXCLUDED.name,
                        email = EXCLUDED.email,
                        image = EXCLUDED.image,
                        updated_at = NOW();
                `;

                console.log('User created successfully:', userId);

                break;
            }

            // USER UPDATED
            case 'user.updated': {

                const userId = data.id;

                if (!primaryEmail) {
                    console.error('Primary email missing:', userId);

                    return res.status(400).json({
                        success: false,
                        error: 'User primary email is missing'
                    });
                }

                await sql`
                    INSERT INTO users (
                        id,
                        name,
                        email,
                        image
                    )
                    VALUES (
                        ${userId},
                        ${name},
                        ${primaryEmail},
                        ${image}
                    )
                    ON CONFLICT (id)
                    DO UPDATE SET
                        name = EXCLUDED.name,
                        email = EXCLUDED.email,
                        image = EXCLUDED.image,
                        updated_at = NOW();
                `;

                console.log('User updated successfully:', userId);

                break;
            }

            // USER DELETED
            case 'user.deleted': {

                const userId = data.id;

                if (userId) {
                    await sql`
                        DELETE FROM users
                        WHERE id = ${userId};
                    `;

                    console.log('User deleted successfully:', userId);
                }

                break;
            }

            // OTHER EVENTS
            default: {

                console.log('Unhandled Clerk event:', eventType);

                break;
            }
        }

        // 5. Send success response
        return res.status(200).json({
            success: true,
            eventType
        });

    } catch (error) {

        console.error('Webhook database/event processing error:', error);

        return res.status(500).json({
            success: false,
            error: 'Webhook event processing failed'
        });
    }
};