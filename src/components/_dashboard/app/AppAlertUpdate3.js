import faker from 'faker';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { formatDistance } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import Pagination from '@mui/material/Pagination';
// material
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader } from '@mui/material';
// utils
import { mockImgCover } from '../../../utils/mockImages';
//
import Scrollbar from '../../Scrollbar';

// ----------------------------------------------------------------------

const NEWS = [...Array(5)].map((_, index) => {
  const setIndex = index + 1;
  return {
    title: faker.name.title(),
    description: faker.lorem.paragraphs(),
    image: mockImgCover(setIndex),
    postedAt: faker.date.soon()
  };
});

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.object.isRequired
};

function NewsItem({ news }) {
  const { image, title, description, postedAt } = news;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ minWidth: 240 }}>
        <Link to="#" color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
        </Link>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {description}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {formatDistance(postedAt, new Date())}
      </Typography>
    </Stack>
  );
}

export default function AppNewsUpdate() {
  return (
    <Card>
      <CardHeader title="중요 알림" />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {NEWS.map((news) => (
            <NewsItem key={news.title} news={news} />
          ))}
        </Stack>
      </Scrollbar>
      <Divider />
      <Pagination count={10} color="primary" />
    </Card>
  );
}
