import * as React from "react";
import { Card, H2, BodyText } from "@apac-ui-warehouse/component-warehouse";
import { motion } from "framer-motion";
import styles from "../views.module.scss";

export const HomePage: React.FC = () => {
  const metrics = [
    { label: "Total PnL", value: "$250,000", trend: "up" },
    { label: "Cash Available", value: "$8,750,000", trend: "up" },
    { label: "Net Exposure", value: "$15,500,000", trend: "up" },
    { label: "Restricted Securities", value: "12", trend: "flat" },
  ];

  const dividendBars = [12, 20, 16, 28, 10, 22, 14, 26];
  const topItems = ["AAPL", "MSFT", "AMZN", "GOOGL"];
  const axeItems = ["UST 5Y", "UST 10Y", "IG Credit", "HY Credit"];
  const novationItems = ["Trade 2456", "Trade 2181", "Trade 1942", "Trade 1813"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.2,
      }}
      className={styles.viewContainer}
    >
      <div className={styles.homeGrid}>
        <div className={styles.metricsRow}>
          {metrics.map((metric) => (
            <Card key={metric.label} className={styles.metricCard}>
              <div className={styles.metricLabel}>{metric.label}</div>
              <div className={styles.metricValue}>{metric.value}</div>
              <div className={`${styles.metricSparkline} ${styles[`metricSparkline${metric.trend}`]}`}>
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </Card>
          ))}
        </div>

        <div className={styles.chartsRow}>
          <Card className={styles.chartCard}>
            <div className={styles.cardHeader}>
              <H2>PnL Trend</H2>
              <BodyText className={styles.cardSubtext}>Last 90 days</BodyText>
            </div>
            <div className={styles.chartCanvas}>
              <svg viewBox="0 0 240 80" className={styles.lineChart}>
                <polyline
                  points="0,60 20,40 40,50 60,35 80,30 100,45 120,25 140,30 160,20 180,25 200,15 220,10 240,8"
                />
              </svg>
              <div className={styles.areaFill} />
            </div>
          </Card>

          <Card className={styles.chartCard}>
            <div className={styles.cardHeader}>
              <H2>Dividend Schedule</H2>
              <BodyText className={styles.cardSubtext}>Next 8 payments</BodyText>
            </div>
            <div className={styles.barChart}>
              {dividendBars.map((value, index) => (
                <div key={index} className={styles.barGroup}>
                  <div className={styles.bar} style={{ height: `${value * 3}px` }} />
                  <div className={styles.barLabel}>{index + 5}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className={styles.bottomRow}>
          <Card className={styles.listCard}>
            <div className={styles.cardHeader}>
              <H2>Top Positions</H2>
              <BodyText className={styles.linkText}>View All</BodyText>
            </div>
            <div className={styles.listItems}>
              {topItems.map((item) => (
                <div key={item} className={styles.listItem}>
                  <span>{item}</span>
                  <span className={styles.listTag}>Long</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className={styles.listCard}>
            <div className={styles.cardHeader}>
              <H2>Axe &amp; Avail</H2>
              <BodyText className={styles.linkText}>View All</BodyText>
            </div>
            <div className={styles.listItems}>
              {axeItems.map((item) => (
                <div key={item} className={styles.listItem}>
                  <span>{item}</span>
                  <span className={styles.listTagAlt}>Buy</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className={styles.listCard}>
            <div className={styles.cardHeader}>
              <H2>Recent Novations</H2>
              <BodyText className={styles.linkText}>View All</BodyText>
            </div>
            <div className={styles.listItems}>
              {novationItems.map((item) => (
                <div key={item} className={styles.listItem}>
                  <span>{item}</span>
                  <span className={styles.listTagNeutral}>Pending</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

