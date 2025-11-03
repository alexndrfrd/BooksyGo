/**
 * Background Job: Flight Price Monitoring
 * Runs periodically to find best deals and update database
 */

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
// import { PrismaService } from '../prisma/prisma.service';
// import { searchFlights, getFlightPriceInsights } from '../integrations/skyscanner';

interface MonitoredRoute {
  id: string;
  origin: string;
  destination: string;
  departureMonth: string;
  userId?: string; // If user subscribed to alerts
  currentBestPrice?: number;
  priceThreshold?: number; // Alert when price drops below this
}

@Injectable()
export class PriceMonitorJob {
  private readonly logger = new Logger(PriceMonitorJob.name);

  // constructor(private prisma: PrismaService) {}

  /**
   * Run every 6 hours to check for price drops
   * Cron: 0 */6 * * * (every 6 hours)
   */
  @Cron(CronExpression.EVERY_6_HOURS)
  async monitorFlightPrices() {
    this.logger.log('🔍 Starting flight price monitoring...');

    try {
      // TODO: Get monitored routes from database
      // const routes = await this.prisma.monitoredRoute.findMany({
      //   where: { active: true },
      // });

      // MOCK: Popular routes to monitor
      const routes: MonitoredRoute[] = [
        {
          id: '1',
          origin: 'OTP',
          destination: 'LON',
          departureMonth: '2025-12',
        },
        {
          id: '2',
          origin: 'OTP',
          destination: 'PAR',
          departureMonth: '2025-12',
        },
        {
          id: '3',
          origin: 'OTP',
          destination: 'BCN',
          departureMonth: '2025-12',
        },
        {
          id: '4',
          origin: 'OTP',
          destination: 'ROM',
          departureMonth: '2025-12',
        },
      ];

      this.logger.log(`📊 Monitoring ${routes.length} routes`);

      for (const route of routes) {
        await this.checkRoutePrice(route);
        // Wait 1 second between requests to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      this.logger.log('✅ Price monitoring completed');
    } catch (error) {
      this.logger.error('❌ Error in price monitoring:', error);
    }
  }

  /**
   * Check price for a specific route
   */
  private async checkRoutePrice(route: MonitoredRoute) {
    try {
      this.logger.log(
        `Checking ${route.origin} → ${route.destination} (${route.departureMonth})`
      );

      // TODO: Call Skyscanner API
      // const insights = await getFlightPriceInsights({
      //   originSkyId: route.origin,
      //   destinationSkyId: route.destination,
      //   departureMonth: route.departureMonth,
      // });

      // MOCK: Simulate price check
      const insights = {
        cheapestMonth: route.departureMonth,
        averagePrice: Math.floor(Math.random() * 200) + 50,
        priceHistory: [],
      };

      this.logger.log(
        `  💰 Average price: €${insights.averagePrice} | Cheapest: ${insights.cheapestMonth}`
      );

      // Check if price dropped significantly
      const priceDrop = route.currentBestPrice
        ? route.currentBestPrice - insights.averagePrice
        : 0;

      if (priceDrop > 20) {
        this.logger.log(
          `  🎉 PRICE DROP! €${priceDrop} cheaper than before!`
        );

        // TODO: Send alert to subscribed users
        // if (route.userId) {
        //   await this.sendPriceAlert(route.userId, route, insights.averagePrice);
        // }

        // TODO: Update database
        // await this.prisma.monitoredRoute.update({
        //   where: { id: route.id },
        //   data: {
        //     currentBestPrice: insights.averagePrice,
        //     lastChecked: new Date(),
        //   },
        // });
      }

      // TODO: Store in best deals cache
      // await this.prisma.bestDeal.upsert({
      //   where: { routeId: route.id },
      //   create: {
      //     routeId: route.id,
      //     origin: route.origin,
      //     destination: route.destination,
      //     price: insights.averagePrice,
      //     validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      //   },
      //   update: {
      //     price: insights.averagePrice,
      //     lastUpdated: new Date(),
      //   },
      // });
    } catch (error) {
      this.logger.error(
        `Error checking price for ${route.origin} → ${route.destination}:`,
        error
      );
    }
  }

  /**
   * Run every day at 8 AM to find best deals for next month
   * Cron: 0 8 * * * (every day at 8:00 AM)
   */
  @Cron('0 8 * * *')
  async findBestDeals() {
    this.logger.log('🎯 Finding best flight deals for next month...');

    try {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const departureMonth = `${nextMonth.getFullYear()}-${String(
        nextMonth.getMonth() + 1
      ).padStart(2, '0')}`;

      // TODO: Get popular routes from analytics
      const popularRoutes = [
        { origin: 'OTP', destination: 'LON' },
        { origin: 'OTP', destination: 'PAR' },
        { origin: 'OTP', destination: 'BCN' },
        { origin: 'OTP', destination: 'ROM' },
        { origin: 'OTP', destination: 'BER' },
        { origin: 'OTP', destination: 'AMS' },
      ];

      const deals: Array<{
        route: string;
        price: number;
        savings: number;
      }> = [];

      for (const route of popularRoutes) {
        try {
          // TODO: Get insights from Skyscanner
          // const insights = await getFlightPriceInsights({
          //   originSkyId: route.origin,
          //   destinationSkyId: route.destination,
          //   departureMonth,
          // });

          // MOCK
          const averagePrice = Math.floor(Math.random() * 200) + 50;
          const cheapestPrice = averagePrice - Math.floor(Math.random() * 50);

          deals.push({
            route: `${route.origin} → ${route.destination}`,
            price: cheapestPrice,
            savings: averagePrice - cheapestPrice,
          });

          this.logger.log(
            `  💎 ${route.origin} → ${route.destination}: €${cheapestPrice} (save €${averagePrice - cheapestPrice})`
          );

          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          this.logger.error(
            `Error getting deal for ${route.origin} → ${route.destination}:`,
            error
          );
        }
      }

      // TODO: Store best deals in database
      // TODO: Send weekly newsletter with best deals
      // TODO: Show on homepage "Best Deals This Week"

      this.logger.log(`✅ Found ${deals.length} great deals!`);
    } catch (error) {
      this.logger.error('❌ Error finding best deals:', error);
    }
  }

  /**
   * Send price drop alert to user
   */
  private async sendPriceAlert(
    userId: string,
    route: MonitoredRoute,
    newPrice: number
  ) {
    this.logger.log(`📧 Sending price alert to user ${userId}`);

    // TODO: Implement email/push notification
    // await this.notificationService.send({
    //   userId,
    //   type: 'price_alert',
    //   title: `Price Drop Alert! ${route.origin} → ${route.destination}`,
    //   message: `The flight you're monitoring is now €${newPrice}!`,
    //   link: `/search?origin=${route.origin}&destination=${route.destination}`,
    // });
  }
}

