import { PointOfInterest, NotificationType } from './point-of-interest';
import fetch from 'node-fetch';
import { load } from 'cheerio';
import { NotificationService } from './notification-service';
import chalk from 'chalk';

export class Page {
    public name: string;
    public url: string;
    public pointsOfInterest: PointOfInterest[];
    public requestFrequency: number;

    private _requestInterval: any;

    public constructor(name: string, url: string, intervalTime: number, pointsOfInterest: PointOfInterest[] = []) {
        this.name = name;
        this.url = url;
        this.requestFrequency = intervalTime;
        this.pointsOfInterest = pointsOfInterest;
    }

    public startScraping() {
        this.scrape();
        this._requestInterval = setInterval(() => this.scrape(), this.requestFrequency);
    }

    public stopScraping() {
        clearInterval(this._requestInterval);
    }

    private async scrape() {
        if(this.pointsOfInterest.length == 0) return;
        try {
            console.log(`Scraping ${this.name} (${this.url})`);
            const response = await fetch(this.url, {method: 'GET', headers: {
                'User-Agent': 'HelloUserAgent/0.1.3',
                'Accept-Encoding': 'gzip'
            }});
            const html = await response.text();
            if(!html) {
                console.log('No HTML in repsonse.');
                return;
            }
            
            const $ = load(html);
            let notifications: PointOfInterest[] = [];
            for(const poi of this.pointsOfInterest) {
                const poiHtml: string = $(`${poi.selector}`).html();
                if(this.shouldNotify(poi, poiHtml)) {
                    notifications.push(poi);
                }
            }
            if(notifications.length > 0) {
                NotificationService.getInstance().sendNotification(this, notifications);
            }            
        } catch (error) {
            console.error(error);
        }
    }

    private shouldNotify(poi: PointOfInterest, poiHtml: string): boolean {
        switch(poi.notificationType) {
            case NotificationType.Found:
                if(poiHtml) {
                    console.log(chalk.bgGreen.whiteBright.bold(' Found element. Something may have changed! '), true);
                    return true;
                }
                break;
            case NotificationType.NotFound:
                if(!poiHtml) {
                    console.log(chalk.bgGreen.whiteBright.bold(' Cannot find element. Something may have changed! '), true);
                    return true;
                } 
                break;
            case NotificationType.Changed:
                if(poi.oldHtml === undefined) {
                    poi.oldHtml = poiHtml;
                    return false;
                }

                if(poi.oldHtml !== poiHtml) {
                    console.log(chalk.bgGreen.whiteBright.bold(' Element children changed! '), true);
                    console.log(`Old: ${poi.oldHtml}`);
                    console.log(`New: ${poiHtml}`);
                    return true;
                }
                break;
        }
        console.log('No updates...');
        return false;
    }
}