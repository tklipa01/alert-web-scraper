import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { PointOfInterest, NotificationType } from './point-of-interest';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { Page } from './page';
import { settings } from './utils';

export class NotificationService {
    public sender: string;
    public senderPassword: string;
    public receiver: string;
    
    private static instance: NotificationService;
    private transporter: Mail;

    private constructor() {
        this.sender = settings.notifications.sender;
        this.senderPassword = settings.notifications.senderPassword;
        this.receiver = settings.notifications.receiver;
    }

    public static getInstance() {
        if(!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    public async sendNotification(page: Page, pointsOfInterest: PointOfInterest[]) {
        if(!this.transporter) {
            this.transporter = nodemailer.createTransport({
                host: "smtp.gmail.com", 
                service: "gmail",           
                auth: {
                    user: this.sender,
                    pass: this.senderPassword
                }
            }); 
        }

        let mailBody = "";

        pointsOfInterest.forEach((poi) => {
            let line = this.getNotificationLine(poi);
            mailBody += line;
        });

        mailBody = `<p>${mailBody}</p><a href='${page.url}'>Check it out!</a>`;

        let mailOptions: MailOptions = {
            from: this.sender,
            to: this.receiver,
            subject: `${page.name}`,
            html: mailBody
        }

        try {
            await this.transporter.sendMail(mailOptions);
        } catch(error) {
            console.error(error);
        }
    }

    private getNotificationLine(poi: PointOfInterest): string {
        switch(poi.notificationType) {
            case NotificationType.Found:
                return `${poi.name}: Found desired element<br>`;
            case NotificationType.NotFound:
                return `${poi.name}: Could not find desired element<br>`;
            case NotificationType.Changed:
                return `${poi.name}: Desired element children have changed<br>`;
        }
    }

}