import React from 'react';
import CommunityPage from '../../components/CommunityPage/CommunityPage';
import ChatCard from '../../components/CommunityPage/sectionChat/chatSection';
import PrivacyInfo from '../../components/CommunityPage/sectionBenefits/PrivacyInfo';
import CyberBanner from '../../components/CommunityPage/sectionBanner/CyberBanner';

const Community = () => {
  return (
    <main >
      <section >
        <CommunityPage />
        <ChatCard/>
        <PrivacyInfo/>
        <CyberBanner/>
      </section>
    </main>
  );
};

export default Community;