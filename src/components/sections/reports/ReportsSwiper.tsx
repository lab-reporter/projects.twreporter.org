'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import ReportsSwiperItem from './ReportsSwiperItem';
import projectsData from '@/app/data/projects.json';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

interface ReportItem {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  section: string[];
  bgColor?: string;
}

export default function ReportsSwiper() {
  // 過濾出 reports section 的項目
  const reportsItems = projectsData.filter((item: ReportItem) => 
    item.section.includes('reports')
  );

  return (
    <div className="w-full h-96">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination]}
        className="h-full"
      >
        {reportsItems.map((item: ReportItem) => (
          <SwiperSlide key={item.id} className="w-80">
            <ReportsSwiperItem
              id={item.id}
              path={item.path}
              title={item.title}
              subtitle={item.subtitle}
              bgColor={item.bgColor}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
