"use client";
import { useEffect, useMemo, useState } from "react";
import { day, db, settings } from "../db";
import dateHelper from "../helpers/dateHelper";
// import Dexie from "dexie";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import Chart from "../components/chart";

export default function DashboardPage() {
  // const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<settings>(null!);
  const hello = ["يا مرحباً", "اهلا", "والف هلا", "مرحبا"];
  const title = useMemo(
    () => hello[Math.floor(Math.random() * hello.length)],
    []
  );
  const times = {
    today: "اليوم",
    yesterday: "امس",
    "this-week": "هذا الاسبوع",
    "last-week": "الاسبوع الماضي",
    "last-7-days": "اخر 7 ايام",
    "this-month": "هذا الشهر",
    "last-30-days": "اخر 30 يوم",
  };
  const [selectdTime, setSelectdTime] = useState({
    title: "هذا الاسبوع",
    key: "this-week",
  });
  const [loadingData, setLoadingData] = useState(true);

  const [totalWeights, setTotalWeights] = useState({
    chart: {
      date: [] as string[],
      value: [] as number[],
    },
    compare: 0,
    total: 0,
  });

  const [totalRounds, setTotalRounds] = useState({
    chart: {
      date: [] as string[],
      value: [] as number[],
    },
    compare: 0,
    total: 0,
  });

  const [totalRepet, setTotalRepet] = useState({
    chart: {
      date: [] as string[],
      value: [] as number[],
    },
    compare: 0,
    total: 0,
  });

  function dateAnalysis(status: string) {
    switch (status) {
      case "today": {
        const date = new Date();

        const endDate = dateHelper({ setDate: date });
        const startDate = dateHelper({ setDate: date });

        date.setDate(date.getDate() - 1);
        const endDateCompare = dateHelper({ setDate: date });
        const startDateCompare = dateHelper({
          setDate: date,
        });

        return {
          show: [startDate, endDate],
          compare: [startDateCompare, endDateCompare],
        };
      }
      case "yesterday": {
        const date = new Date();

        date.setDate(date.getDate() - 1);
        const endDate = dateHelper({ setDate: date });
        const startDate = dateHelper({ setDate: date });

        date.setDate(date.getDate() - 1);
        const endDateCompare = dateHelper({ setDate: date });
        const startDateCompare = dateHelper({
          setDate: date,
          dateAsText: true,
        });

        return {
          show: [startDate, endDate],
          compare: [startDateCompare, endDateCompare],
        };
      }
      case "this-week": {
        const date = new Date();

        date.setDate(date.getDate() - date.getDay());

        const startDate = dateHelper({ setDate: date });

        date.setDate(date.getDate() + 6);
        const endDate = dateHelper({ setDate: date });

        date.setDate(date.getDate() - 7);
        const endDateCompare = dateHelper({ setDate: date });

        date.setDate(date.getDate() - 6);
        const startDateCompare = dateHelper({
          setDate: date,
        });


        
        return {
          show: [startDate, endDate],
          compare: [startDateCompare, endDateCompare],
        };
      }
      case "last-week": {
        const date = new Date();
        date.setDate(date.getDate() - date.getDay() - 1);
        const endDate = date.getTime(); // dateHelper({ setDate: date, dateAsText: true })
        date.setDate(date.getDate() - 6);
        const startDate = date.getTime();

        date.setDate(date.getDate() - 1);
        const endDateCompare = date.getTime();
        date.setDate(date.getDate() - 6);
        const startDateCompare = date.getTime();
        return {
          show: [startDate, endDate],
          compare: [startDateCompare, endDateCompare],
        };
      }
      case "last-7-days": {
        const date = new Date();

        // date.setDate(date.getDate()-date.getDay()-1);
        const endDate = dateHelper({ setDate: date });
        date.setDate(date.getDate() - 6);
        const startDate = dateHelper({ setDate: date });

        date.setDate(date.getDate() - 1);
        const endDateCompare = dateHelper({ setDate: date });
        date.setDate(date.getDate() - 6);
        const startDateCompare = dateHelper({
          setDate: date,
          dateAsText: true,
        });

        return {
          show: [startDate, endDate],
          compare: [startDateCompare, endDateCompare],
        };
      }
      case "this-month": {
        const date = new Date();

        date.setMonth(date.getMonth() + 1);
        date.setDate(0);
        const endDate = dateHelper({ setDate: date });

        date.setDate(1);
        const startDate = dateHelper({ setDate: date });

        date.setMonth(date.getMonth());
        date.setDate(0);
        const endDateCompare = dateHelper({ setDate: date });

        date.setDate(1);
        const startDateCompare = dateHelper({
          setDate: date,
          dateAsText: true,
        });

        return {
          show: [startDate, endDate],
          compare: [startDateCompare, endDateCompare],
        };
      }
      case "last-30-days": {
        const date = new Date();

        const endDate = dateHelper({ setDate: date });
        date.setDate(date.getDate() - 29);
        const startDate = dateHelper({ setDate: date });

        date.setDate(date.getDate() - 1);
        const endDateCompare = dateHelper({ setDate: date });
        date.setDate(date.getDate() - 29);
        const startDateCompare = dateHelper({
          setDate: date,
        });

        return {
          show: [startDate, endDate],
          compare: [startDateCompare, endDateCompare],
        };
      }
    }
  }

  async function getData(status: string) {
    // switch (status) {
    //   case "last-week": {

    //   }
    // }

    const dates = dateAnalysis(status);

    

    const showData = await db.days
      .where("date")
      .between(dates?.show[0], dates?.show[1])
      .reverse()
      .toArray();

    // console.log(dates?.show[0], dates?.show[1],'test');

    // console.log(dateHelper({setDate:dates?.show[0],dateAsText:true}), dateHelper({setDate:dates?.show[1],dateAsText:true}));

    const compareData = await db.days
      .where("date")
      .between(dates?.compare[0], dates?.compare[1])
      .reverse()
      .toArray();

    return [showData, compareData];
  }

  function setDefaults() {
    setTotalWeights({
      chart: {
        date: [] as string[],
        value: [] as number[],
      },
      compare: 0,
      total: 0,
    });
    setTotalRounds({
      chart: {
        date: [] as string[],
        value: [] as number[],
      },
      compare: 0,
      total: 0,
    });
    setTotalRepet({
      chart: {
        date: [] as string[],
        value: [] as number[],
      },
      compare: 0,
      total: 0,
    });
  }
  async function calcAll(status: string, settings: settings) {
    setLoadingData(true);
    setDefaults();
    const dates = (await getData(status)) as [day[], day[]];
    // console.log(status);
    const show = dates[0];
    const compare = dates[1];

    if (!show.length) {
      setTotalWeights({
        ...totalWeights,
        chart: {
          date: [],
          value: [],
        },
        total: 0,
      });
      setTotalRounds({
        ...totalRounds,
        chart: {
          date: [],
          value: [],
        },
        total: 0,
      });
      setTotalRepet({
        ...totalRepet,
        chart: {
          date: [],
          value: [],
        },
        total: 0,
      });
    }

    if (!compare.length) {
      setTotalWeights((crru) => {
        return {
          ...crru,
          compare: 0,
        };
      });
      setTotalRounds((crru) => {
        return {
          ...crru,
          compare: 0,
        };
      });
      setTotalRepet((crru) => {
        return {
          ...crru,
          compare: 0,
        };
      });
    }

    for (let i = 0; i < show.length; i++) {
      const item = show[i];
      let isFind = null!;
      let push = false;

      const date = dateHelper({
        setDate: item.date,
        dateAsText: true,
      }) as string;

      setTotalWeights((crru) => {
        const copy = { ...crru };

        isFind = copy.chart.date.findIndex((e) => e == date);

        push = isFind === -1;

        const sumRounds = item.rounds.reduce((e, c) => {
          if (c.unit == "kg" && settings?.defaultUnit == "lb") {
            c.weight = Math.round(c.weight * 0.45359237);
          } else if (c.unit == "lb" && settings?.defaultUnit == "kg") {
            c.weight = Math.round(c.weight / 0.45359237);
          }
          return c.weight * c.repet + e;
        }, 0);

        copy.total += sumRounds;

        if (push) {
          copy.chart.date.push(date);
          copy.chart.value.push(sumRounds);
        } else {
          copy.chart.value[isFind] = copy.chart.value[isFind] + sumRounds;
        }

        return copy;
      });

      setTotalRounds((crru) => {
        const copy = { ...crru };

        copy.total += item.rounds.length;

        if (push) {
          copy.chart.date.push(date);
          copy.chart.value.push(item.rounds.length);
        } else {
          copy.chart.value[isFind] =
            copy.chart.value[isFind] + item.rounds.length;
        }

        // console.log(copy);

        return copy;
      });

      setTotalRepet((crru) => {
        const copy = { ...crru };

        const sumRepet = item.rounds.reduce((e, c) => {
          return c.repet + e;
        }, 0);

        copy.total += sumRepet;

        if (push) {
          copy.chart.date.push(date);
          copy.chart.value.push(sumRepet);
        } else {
          copy.chart.value[isFind] = copy.chart.value[isFind] + sumRepet;
        }

        return copy;
      });
    }

    for (let i = 0; i < compare.length; i++) {
      const item = compare[i];
      // const rounds = 0;

      setTotalWeights((crru) => {
        const copy = { ...crru };

        copy.compare += item.rounds.reduce((e, c) => {
          if (c.unit == "kg" && settings?.defaultUnit == "lb") {
            c.weight = Math.round(c.weight * 0.45359237);
          } else if (c.unit == "lb" && settings?.defaultUnit == "kg") {
            c.weight = Math.round(c.weight / 0.45359237);
          }
          return c.weight * c.repet + e;
        }, 0);

        return copy;
      });

      setTotalRounds((crru) => {
        const copy = { ...crru };

        copy.compare += item.rounds.length;

        return copy;
      });

      setTotalRepet((crru) => {
        const copy = { ...crru };

        const sumRepet = item.rounds.reduce((e, c) => {
          return c.repet + e;
        }, 0);
        copy.compare += sumRepet;

        return copy;
      });
    }

    setLoadingData(false);
  }

  useEffect(() => {
    async function init() {
      const settingsLoad = (await db.settings.get(1)!) as settings;
      setSettings(settingsLoad);
      await calcAll(settingsLoad.defaultStatistics, settingsLoad);
    }
    init();
  }, []);

  // if (isLoading) {
  //   return null; // This will trigger the Suspense fallback
  // }

  async function refreshDate(e) {
    await db.settings.update(1,{defaultStatistics:e.currentKey});
    calcAll(e.currentKey, settings).then(() => {
      setSelectdTime({
        title: times[e.currentKey],
        key: e.currentKey,
      });
    });
  }

  function levelCalc(total,compare) {
    // console.log(total,compare);
    if(compare == 0) {
      return total;
    }
    return Math.round(((total - compare) / compare) * 100);
  
  }

  return (
    <div className="dashboardPage">
      <div className="header">
       
        <h1>
          {title}, {settings?.name}
        </h1>
        <div className="select-time">
          <Dropdown>
            <DropdownTrigger>
              <Button className="button" isLoading={loadingData} variant="light">
                {selectdTime.title} ⬇️
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Single selection example"
              selectedKeys={[selectdTime.key]}
              selectionMode="single"
              variant="flat"
              onSelectionChange={refreshDate}>
              {Object.keys(times).map((o) => {
                return <DropdownItem key={o}>{times[o]}</DropdownItem>;
              })}
             
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className="content">
        <div className="statistics">
          <div className="lineChart">
            <div className="top">
              <p className="title">مجموع الاوزان 🔥</p>
              {totalWeights.total > totalWeights.compare ? (
                <span className="tag green">+{levelCalc(totalWeights.total,totalWeights.compare)}%</span>
              ) : totalWeights.total < totalWeights.compare ? (
                <span className="tag red">{levelCalc(totalWeights.total,totalWeights.compare)}%</span>
              ) : (
                ""
              )}
            </div>
            <div className="value">
              <h2>{totalWeights.total}</h2>
              <p>{settings?.defaultUnit}</p>
            </div>
            <div className="chart">
              <Chart row={totalWeights.chart.date} column={totalWeights.chart.value} total={totalWeights.total} compare={totalWeights.compare} />
            </div>
          </div>
          <div className="lineChart">
            <div className="top">
              <p className="title">مجموع الجولات 🪐</p>
              {totalRounds.total > totalRounds.compare ? (
                <span className="tag green">+{levelCalc(totalRounds.total,totalRounds.compare)}%</span>
              ) : totalRounds.total < totalRounds.compare ? (
                <span className="tag red">{levelCalc(totalRounds.total,totalRounds.compare)}%</span>
              ) : (
                ""
              )}
            </div>
            <div className="value">
              <h2>{totalRounds.total}</h2>
              <p>عدة</p>
            </div>
            <div className="chart">
              <Chart row={totalRounds.chart.date} column={totalRounds.chart.value} total={totalRounds.total} compare={totalRounds.compare} />
            </div>
          </div>
          <div className="lineChart">
            <div className="top">
              <p className="title">مجموع التكرارات ➿</p>
              {totalRepet.total > totalRepet.compare ? (
                <span className="tag green">+{levelCalc(totalRepet.total,totalRepet.compare)}%</span>
              ) : totalRepet.total < totalRepet.compare ? (
                <span className="tag red">{levelCalc(totalRepet.total,totalRepet.compare)}%</span>
              ) : (
                ""
              )}
            </div>
            <div className="value">
              <h2>{totalRepet.total}</h2>
              <p>تكرار</p>
            </div>
            <div className="chart">
              <Chart row={totalRepet.chart.date} column={totalRepet.chart.value} total={totalRepet.total} compare={totalRepet.compare} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
