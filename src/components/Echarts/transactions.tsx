import { observer } from "mobx-react-lite";
import ReactEcharts from 'echarts-for-react';
import { Select } from '@headlessui/react'
import { useEffect, useState } from "react";
import { wnftStatApi } from "@/api/wnft/stat";
import { successCode } from "@/lib/constants";
import { useAccount } from "wagmi";
import { symbol } from "@/lib/chainTerms";
import { truncateDynamic } from "@/lib/utils";

const PriceChart = ({wnftId}: {wnftId: string}) => {

  const account = useAccount();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState();

  const option = {
    color: ["#3398DB"],
    title: {
      text: ''
    },
    tooltip: {
      trigger: 'axis',
      // formatter: '{b} {c}'
    },
    xAxis: {
      name: 'Time',
      nameLocation: 'end',
      type: 'time',  // 使用时间类型
      boundaryGap: false,
      axisLabel: {
        formatter: '{yyyy}/{MM}/{dd}' // 格式化显示时间，可根据需要调整
      }
    },
    yAxis: {
      name: symbol(account.chainId),
      nameLocation: 'end',
      type: 'value'
    },
    series: [
      {
        name: '数据值',
        type: 'line',
        data: data,
        smooth: true // 使曲线平滑
      }
    ]
  };

  useEffect(() => {
    const queryPage = async () => {
      try {
        const today = new Date();
        const monthAgo = new Date(today);
        monthAgo.setDate(today.getDate() - 30)
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        let params = {
          wnftId: wnftId,
          startTime: monthAgo,
          endTime: tomorrow
        };
        await wnftStatApi.priceStat(params).then(resp => {
          if (resp && resp.code === successCode) {
            setData(resp.data)
          } else {
            alert(resp.msg);
          }
        }).catch((error) => {
          setError(error)
          console.log(error);
        })
        
      } catch (err) {
        console.log("get wnft page list error: ", err);
      } finally {
        setLoading(false);
      }
    }
    queryPage()
  }, [])

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <ReactEcharts option={option} />
    </>
  )
}

const TradeTable = ({wnftId}: {wnftId: string}) => {

  const [data, setData] = useState([{
    tradeId: '',
    wnftId: '',
    seller: '',
    buyer: '',
    dealPrice: '',
    dealTime: '',
  }])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(10);
  const [pageNums, setPageNums] = useState([<option value="1">1</option>]);
  const rows = [10, 20, 50];

  useEffect(() => {
    const queryPage = async () => {
      let params = {
        wnftId: wnftId,
        pageSize: selectedRows,
        page: selectedPage
      }
      try {
        await wnftStatApi.tradePage(params).then(resp => {
          if (resp && resp.code === successCode) {
            let pages = []
            setData(resp.data.list)
            for (let i = 1; i <= resp.data.total / selectedRows + 1; i++) {
              pages.push(
                <option value={i}>{i}</option>
              )
            }
            setPageNums(pages)
          } else {
            alert(resp.msg);
          }
        }).catch((error) => {
          setError(error)
          console.log(error);
        })
      } catch (err) {
        console.log("trade page error: ", err);
      } finally {
        setLoading(false);
      }
    }
    queryPage()
  }, [selectedRows, selectedPage])
  

  const handleSelectPageChange = (event: any) => {
    setSelectedPage(event.target.value);
    console.log("selectedPage:", event.target.value); // 打印选中的值
  };

  const handleSelectRowsChange = (event: any) => {
    setSelectedRows(event.target.value);
    console.log("selectedRows:", event.target.value); // 打印选中的值
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-sm table-zebra">
        <thead>
          <tr>
            <th>Id</th>
            <th>Seller</th>
            <th>Buyer</th>
            <th>Price</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map(item => {
            return (
            <tr >
              <th>{item.tradeId}</th>
              <td>
                <div className="relative group">
                  <div className="truncate">
                    {truncateDynamic(item.seller, 23)}
                  </div>
                  <div className="absolute hidden group-hover:flex bg-gray-900 text-white text-sm p-2 rounded shadow-lg -top-8 left-0 z-50">
                    {item.seller}
                  </div>
                </div>
              </td>
              <td>
                <div className="relative group">
                  <div className="truncate">
                    {truncateDynamic(item.buyer, 23)}
                  </div>
                  <div className="absolute hidden group-hover:flex bg-gray-900 text-white text-sm p-2 rounded shadow-lg -top-8 left-0 z-50">
                    {item.buyer}
                  </div>
                </div>
              </td>
              <td>{item.dealPrice}</td>
              <td>{item.dealTime}</td>
            </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium">rows</span>
          <Select name="rows" value={selectedRows} onChange={handleSelectRowsChange}>
            {
              rows.map(row => {
                return (
                  <option value={row}>{row}</option>
                )
              })
            }
          </Select>
        </div>
        <div className="join">
          <button className="join-item btn-sm" disabled={selectedPage<=1}>«</button>
          <Select name="page" value={selectedPage} onChange={handleSelectPageChange}>
            {pageNums}
          </Select>
          <button className="join-item btn-sm">»</button>
        </div>
      </div>
    </div>
  )
}

const TransactionTable = ({wnftId}: {wnftId: string}) => {

  const [data, setData] = useState([{
    txId: '',
    detailId: '',
    txHash: '',
    txStatus: '',
    txType: '',
    createTime: '',
  }])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(10);
  const [pageNums, setPageNums] = useState([<option value="1">1</option>]);
  const rows = [10, 20, 50];

  useEffect(() => {
    const queryPage = async () => {
      let params = {
        wnftId: wnftId,
        pageSize: selectedRows,
        page: selectedPage
      }
      try {
        await wnftStatApi.transactionPage(params).then(resp => {
          if (resp && resp.code === successCode) {
            let pages = []
            setData(resp.data.list)
            for (let i = 1; i <= resp.data.total / selectedRows + 1; i++) {
              pages.push(
                <option value={i}>{i}</option>
              )
            }
            setPageNums(pages)
          } else {
            alert(resp.msg);
          }
        }).catch((error) => {
          setError(error)
          console.log(error);
        })
      } catch (err) {
        console.log("trade page error: ", err);
      } finally {
        setLoading(false);
      }
    }
    queryPage()
  }, [selectedRows, selectedPage])
  

  const handleSelectPageChange = (event: any) => {
    setSelectedPage(event.target.value);
    console.log("selectedPage:", event.target.value); // 打印选中的值
  };

  const handleSelectRowsChange = (event: any) => {
    setSelectedRows(event.target.value);
    console.log("selectedRows:", event.target.value); 
  };

  const getStatusColor = (status: string) => {
    if (status === 'error') return 'text-red-500'; 
    if (status === 'success') return 'text-green-500'; 
    if (status === 'info') return 'text-blue-500';    
    return 'text-gray-500';                           
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-sm table-zebra">
        <thead>
          <tr>
            <th>Id</th>
            <th>Hash</th>
            <th>Status</th>
            <th>Event</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => {
            return (
            <tr>
              <th>{item.txId}</th>
              <td>
                <div className="relative group">
                  <div className="truncate">
                    {truncateDynamic(item.txHash, 23)}
                  </div>
                  <div className="absolute hidden group-hover:flex bg-gray-900 text-white text-sm p-2 rounded shadow-lg -top-8 left-0 z-50">
                    {item.txHash}
                  </div>
                </div>
              </td>
              <td><p className={`font-semibold ${getStatusColor(item.txStatus)}`}>{item.txStatus}</p></td>
              <td>{item.txType}</td>
              <td>{item.createTime}</td>
            </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium">rows</span>
          <Select name="rows" value={selectedRows} onChange={handleSelectRowsChange}>
            {
              rows.map(row => {
                return (
                  <option value={row}>{row}</option>
                )
              })
            }
          </Select>
        </div>
        <div className="join">
          <button className="join-item btn-sm" disabled={selectedPage<=1}>«</button>
          <Select name="page" value={selectedPage} onChange={handleSelectPageChange}>
            {pageNums}
          </Select>
          <button className="join-item btn-sm">»</button>
        </div>
      </div>
    </div>
  )
}

const TransactionEcharts = ({wnftId}: {wnftId: string}) => {


  return (
    <div role="tablist" className="tabs tabs-bordered">
      <input type="radio" name="tx_tab" role="tab" className="tab" aria-label="Price" defaultChecked />
      <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
        <PriceChart wnftId={wnftId} />
      </div>

      <input type="radio" name="tx_tab" role="tab" className="tab" aria-label="Trade" />
      <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
        <TradeTable wnftId={wnftId} />
      </div>

      <input type="radio" name="tx_tab" role="tab" className="tab" aria-label="Transaction" />
      <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
        <TransactionTable wnftId={wnftId} />
      </div>
    </div>
  )
}

export default observer(TransactionEcharts);