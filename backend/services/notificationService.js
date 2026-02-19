import cron from 'node-cron';
import ServiceProvider from '../models/ServiceProvider.js';
import Notification from '../models/Notification.js';

/**
 * Checks for subscription expiration and sends notifications
 * Runs daily at midnight
 */
export const initSubscriptionCheck = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('Running Subscription Expiry Check...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const sevenDaysFromNow = new Date(today);
            sevenDaysFromNow.setDate(today.getDate() + 7);

            // 1. Check for expiry in exactly 7 days
            const providersExpiringIn7Days = await ServiceProvider.find({
                'subscription.active': true,
                'subscription.expiry_date': {
                    $gte: sevenDaysFromNow,
                    $lt: new Date(sevenDaysFromNow.getTime() + 24 * 60 * 60 * 1000)
                }
            });

            for (const provider of providersExpiringIn7Days) {
                await Notification.create({
                    user_id: provider.user_id,
                    title: 'Subscription Expiring Soon',
                    message: `Your subscription will expire in 7 days on ${provider.subscription.expiry_date.toDateString()}. Please renew to continue your services.`,
                    type: 'SUBSCRIPTION_EXPIRY'
                });
            }

            // 2. Check for expiry today
            const providersExpiringToday = await ServiceProvider.find({
                'subscription.active': true,
                'subscription.expiry_date': {
                    $gte: today,
                    $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                }
            });

            for (const provider of providersExpiringToday) {
                await Notification.create({
                    user_id: provider.user_id,
                    title: 'Subscription Expired',
                    message: 'Your subscription has expired today. Your listings may be hidden from customers until you renew.',
                    type: 'SUBSCRIPTION_EXPIRY'
                });

                // Optionally deactivate subscription automatically
                // provider.subscription.active = false;
                // await provider.save();
            }

            console.log(`Subscription check complete. Notified ${providersExpiringIn7Days.length} providers (7 days) and ${providersExpiringToday.length} providers (expired today).`);
        } catch (error) {
            console.error('Subscription Check Cron Error:', error);
        }
    });
};
