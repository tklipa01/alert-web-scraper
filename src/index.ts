import { Page } from './page';
import { PointOfInterest } from './point-of-interest';
import { settings } from './utils';

// Create necessary objects
let pages: Page[] = [];
settings.pages.forEach((e: Page) => {
    let pointsOfInterest: PointOfInterest[] = [];
    e.pointsOfInterest.forEach((poi) => {
        pointsOfInterest.push(new PointOfInterest(poi.name, poi.selector, poi.notificationType));
    });    
    pages.push(new Page(e.name, e.url, e.requestFrequency, pointsOfInterest));
});

// Start scraping
pages.forEach((page) => {
    page.startScraping();
})
