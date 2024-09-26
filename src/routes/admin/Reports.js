import { ResponsiveLine } from '@nivo/line';

function Reports() {
  const data = [
    {
      id: 'japan',
      color: 'hsl(7, 70%, 50%)',
      data: [
        {
          x: 'plane',
          y: 7,
        },
        {
          x: 'helicopter',
          y: 111,
        },
        {
          x: 'boat',
          y: 166,
        },
        {
          x: 'train',
          y: 162,
        },
        {
          x: 'subway',
          y: 227,
        },
        {
          x: 'bus',
          y: 57,
        },
        {
          x: 'car',
          y: 245,
        },
        {
          x: 'moto',
          y: 129,
        },
        {
          x: 'bicycle',
          y: 120,
        },
        {
          x: 'horse',
          y: 169,
        },
        {
          x: 'skateboard',
          y: 178,
        },
        {
          x: 'others',
          y: 154,
        },
      ],
    },
    {
      id: 'france',
      color: 'hsl(121, 70%, 50%)',
      data: [
        {
          x: 'plane',
          y: 33,
        },
        {
          x: 'helicopter',
          y: 13,
        },
        {
          x: 'boat',
          y: 201,
        },
        {
          x: 'train',
          y: 113,
        },
        {
          x: 'subway',
          y: 23,
        },
        {
          x: 'bus',
          y: 158,
        },
        {
          x: 'car',
          y: 45,
        },
        {
          x: 'moto',
          y: 230,
        },
        {
          x: 'bicycle',
          y: 295,
        },
        {
          x: 'horse',
          y: 93,
        },
        {
          x: 'skateboard',
          y: 243,
        },
        {
          x: 'others',
          y: 166,
        },
      ],
    },
    {
      id: 'us',
      color: 'hsl(68, 70%, 50%)',
      data: [
        {
          x: 'plane',
          y: 179,
        },
        {
          x: 'helicopter',
          y: 124,
        },
        {
          x: 'boat',
          y: 239,
        },
        {
          x: 'train',
          y: 67,
        },
        {
          x: 'subway',
          y: 201,
        },
        {
          x: 'bus',
          y: 190,
        },
        {
          x: 'car',
          y: 265,
        },
        {
          x: 'moto',
          y: 265,
        },
        {
          x: 'bicycle',
          y: 34,
        },
        {
          x: 'horse',
          y: 0,
        },
        {
          x: 'skateboard',
          y: 42,
        },
        {
          x: 'others',
          y: 153,
        },
      ],
    },
    {
      id: 'germany',
      color: 'hsl(30, 70%, 50%)',
      data: [
        {
          x: 'plane',
          y: 126,
        },
        {
          x: 'helicopter',
          y: 80,
        },
        {
          x: 'boat',
          y: 153,
        },
        {
          x: 'train',
          y: 182,
        },
        {
          x: 'subway',
          y: 257,
        },
        {
          x: 'bus',
          y: 225,
        },
        {
          x: 'car',
          y: 209,
        },
        {
          x: 'moto',
          y: 202,
        },
        {
          x: 'bicycle',
          y: 260,
        },
        {
          x: 'horse',
          y: 100,
        },
        {
          x: 'skateboard',
          y: 209,
        },
        {
          x: 'others',
          y: 64,
        },
      ],
    },
    {
      id: 'norway',
      color: 'hsl(348, 70%, 50%)',
      data: [
        {
          x: 'plane',
          y: 123,
        },
        {
          x: 'helicopter',
          y: 154,
        },
        {
          x: 'boat',
          y: 192,
        },
        {
          x: 'train',
          y: 188,
        },
        {
          x: 'subway',
          y: 46,
        },
        {
          x: 'bus',
          y: 283,
        },
        {
          x: 'car',
          y: 82,
        },
        {
          x: 'moto',
          y: 169,
        },
        {
          x: 'bicycle',
          y: 165,
        },
        {
          x: 'horse',
          y: 20,
        },
        {
          x: 'skateboard',
          y: 105,
        },
        {
          x: 'others',
          y: 29,
        },
      ],
    },
  ];

  const MyResponsiveLine = ({ data /* see data tab */ }) => (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'transportation',
        legendOffset: 36,
        legendPosition: 'middle',
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'count',
        legendOffset: -40,
        legendPosition: 'middle',
        truncateTickAt: 0,
      }}
      enablePoints={false}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel="data.yFormatted"
      pointLabelYOffset={-12}
      enableTouchCrosshair={true}
      useMesh={true}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
  return (
    <div
      style={{
        height: '500px',
      }}
    >
      <h2 style={{ margin: '15px' }}>상품기록</h2>
      <MyResponsiveLine data={data}></MyResponsiveLine>
    </div>
  );
}

export default Reports;
