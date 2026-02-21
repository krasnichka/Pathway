import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Person4Icon from '@mui/icons-material/Person4';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Данные и настройки для графика роста пользователей
const internetUsersOptions = {
  title: {
    text: 'Growth of Internet Users Worldwide (logarithmic scale)'
  },
  accessibility: {
    point: {
      valueDescriptionFormat: '{xDescription}{separator}{value} million(s)'
    }
  },
  xAxis: {
    title: {
      text: 'Year'
    },
    categories: [1995, 2000, 2005, 2010, 2015, 2020, 2023]
  },
  yAxis: {
    type: 'logarithmic',
    title: {
      text: 'Number of Internet Users (in millions)'
    },
    min: 1 
  },
  tooltip: {
    headerFormat: '<b>{series.name}</b><br />',
    pointFormat: '{point.y} million(s)'
  },
  series: [{
    name: 'Internet Users',
    data: [16, 361, 1018, 2025, 3192, 4673, 5200],
    color: '#2caffe'
  }]
};

// Данные и настройки для графика выбора профориентации
const profileChoiceOptions = {
  chart: {
    type: 'column'
  },
  title: {
    text: 'Выбор профориентации школьника за последние 5 лет'
  },
  xAxis: {
    categories: ['2018', '2019', '2020', '2021', '2022']
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Количество учеников'
    }
  },
  series: [{
    name: 'Наука',
    data: [5, 10, 15, 20, 25]
  }, {
    name: 'Искусство',
    data: [3, 6, 9, 12, 15]
  }, {
    name: 'Технологии',
    data: [8, 12, 16, 18, 22]
  }, {
    name: 'Спорт',
    data: [2, 4, 6, 8, 10]
  }]
};

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);

  return (
    <>
    <h1>
      fffff
    </h1>
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto', pb: 4 }}>
      {/* Меню навигации */}
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{ mb: 3 }}
      >
        <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
        <BottomNavigationAction label="Profile" icon={<Person4Icon />} />
      </BottomNavigation>
      
      {/* Контейнер графика роста пользователей */}
      <Box sx={{ 
        width: '100%', 
        height: 400, 
        border: '1px solid #eee',
        borderRadius: 2,
        p: 1,
        mb: 3 // Отступ между графиками
      }}>
        <HighchartsReact
          highcharts={Highcharts}
          options={internetUsersOptions}
        />
      </Box>

      {/* Контейнер графика выбора профориентации */}
      <Box sx={{ 
        width: '100%', 
        height: 400, 
        border: '1px solid #eee',
        borderRadius: 2,
        p: 1
      }}>
        <HighchartsReact
          highcharts={Highcharts}
          options={profileChoiceOptions}
        />
      </Box>
    </Box>
    </>
  );
}