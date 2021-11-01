/**
 * Users Area Chart Widget
 */
import React from 'react';
import CountUp from 'react-countup';
// chart
import TinyAreaChart from "../Charts/TinyAreaChart";
// chart config
import ChartConfig from 'Constants/chart-config';
// intl messages
import IntlMessages from 'Util/IntlMessages';
// rct card box
import { RctCard, RctCardContent } from '../RctCard';
// helpers
import { hexToRgbA } from 'Helpers/helpers';

export const DailyUsersAreaChart = ({ data }) => {
    console.log(data)
    return(
    <RctCard>
        <RctCardContent>
            <div className="clearfix">
                <div className="float-left">
                    <h3 className="mb-15 fw-semi-bold">Daily Sales</h3>
                    <div className="d-flex">
                        <div className="mr-50">
                            <CountUp separator="," className="counter-point" start={0} end={data} duration={2} useEasing={true} />
                        </div>
                    </div>
                </div>
                <div className="float-right hidden-md-down">
                    <div className="featured-section-icon">
                        <i className="zmdi zmdi-shopping-cart"></i>
                    </div>
                </div>
            </div>
        </RctCardContent>
    </RctCard>
    )
};
export const WeeklyUsersAreaChart = ({ data }) => (
    <RctCard>
        <RctCardContent>
            <div className="clearfix">
                <div className="float-left">
                    <h3 className="mb-15 fw-semi-bold">Weekly Sales</h3>
                    <div className="d-flex">
                        <div className="mr-50">
                            <CountUp separator="," className="counter-point" start={0} end={data} duration={5} useEasing={true} />
                        </div>
                    </div>
                </div>
                <div className="float-right hidden-md-down">
                    <div className="featured-section-icon">
                        <i className="zmdi zmdi-shopping-cart"></i>
                    </div>
                </div>
            </div>
        </RctCardContent>
    </RctCard>
);
export const MonthlyUsersAreaChart = ({ data }) => (
    <RctCard>
        <RctCardContent>
            <div className="clearfix">
                <div className="float-left">
                    <h3 className="mb-15 fw-semi-bold">Monthly Sales</h3>
                    <div className="d-flex">
                        <div className="mr-50">
                            <CountUp separator="," className="counter-point" start={0} end={data} duration={5} useEasing={true} />
                        </div>
                    </div>
                </div>
                <div className="float-right hidden-md-down">
                    <div className="featured-section-icon">
                        <i className="zmdi zmdi-shopping-cart"></i>
                    </div>
                </div>
            </div>
        </RctCardContent>
    </RctCard>
);

