/**
 * Orders Area Chart Widget
 */
import React from 'react';
import CountUp from 'react-countup';

// chart
import TinyAreaChart from '../../../lib/vendor/Charts/TinyAreaChart';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// chart config
import ChartConfig from 'Constants/chart-config';

// rct card box
import { RctCard, RctCardContent } from '../../../lib/vendor/RctCard';

// helpers
import { hexToRgbA } from 'Helpers/helpers';

export const DailyOrdersAreaChart = ({ data }) => (
    <RctCard>
        <RctCardContent>
            <div className="clearfix">
                <div className="float-left">
                    <h3 className="mb-15 fw-semi-bold">Daily appointments</h3>
                    <div className="d-flex">
                        <div className="mr-50">
                            <span className="fs-14 d-block"><IntlMessages id="widgets.today" /></span>
                            <CountUp separator="," className="counter-point" start={0} end={data.today} duration={5} useEasing={true} />
                        </div>
                    </div>
                </div>
                <div className="float-right hidden-md-down">
                    <div className="featured-section-icon">
                        <i className="zmdi zmdi-flash"></i>
                    </div>
                </div>
            </div>
        </RctCardContent>
        <TinyAreaChart
            label="Orders"
            chartdata={data.chartData.data}
            labels={data.chartData.labels}
            backgroundColor={hexToRgbA(ChartConfig.color.warning, 0.1)}
            borderColor={hexToRgbA(ChartConfig.color.warning, 3)}
            lineTension="0"
            height={70}
            gradient
            hideDots
        />
    </RctCard>
);

export const WeeklyOrdersAreaChart = ({ data }) => (
    <RctCard>
        <RctCardContent>
            <div className="clearfix">
                <div className="float-left">
                    <h3 className="mb-15 fw-semi-bold">Weekly Appointments</h3>
                    <div className="d-flex">
                        <div className="mr-50">
                            <span className="fs-14 d-block"><IntlMessages id="widgets.week" /></span>
                            <CountUp separator="," className="counter-point" start={0} end={data.weekly} duration={5} useEasing={true} />
                        </div>
                    </div>
                </div>
                <div className="float-right hidden-md-down">
                    <div className="featured-section-icon">
                        <i className="zmdi zmdi-flash"></i>
                    </div>
                </div>
            </div>
        </RctCardContent>
        <TinyAreaChart
            label="Orders"
            chartdata={data.chartData.data}
            labels={data.chartData.labels}
            backgroundColor={hexToRgbA(ChartConfig.color.warning, 0.1)}
            borderColor={hexToRgbA(ChartConfig.color.warning, 3)}
            lineTension="0"
            height={70}
            gradient
            hideDots
        />
    </RctCard>
);
export const MonthlyOrdersAreaChart = ({ data }) => (
    <RctCard>
        <RctCardContent>
            <div className="clearfix">
                <div className="float-left">
                    <h3 className="mb-15 fw-semi-bold">Monthly Appointments</h3>
                    <div className="d-flex">
                        <div className="mr-50">
                            <span className="fs-14 d-block"><IntlMessages id="widgets.monthly" /></span>
                            <CountUp separator="," className="counter-point" start={0} end={data.monthly} duration={5} useEasing={true} />
                        </div>
                    </div>
                </div>
                <div className="float-right hidden-md-down">
                    <div className="featured-section-icon">
                        <i className="zmdi zmdi-flash"></i>
                    </div>
                </div>
            </div>
        </RctCardContent>
        <TinyAreaChart
            label="Orders"
            chartdata={data.chartData.data}
            labels={data.chartData.labels}
            backgroundColor={hexToRgbA(ChartConfig.color.warning, 0.1)}
            borderColor={hexToRgbA(ChartConfig.color.warning, 3)}
            lineTension="0"
            height={70}
            gradient
            hideDots
        />
    </RctCard>
);

