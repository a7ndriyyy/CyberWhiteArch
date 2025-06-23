import React from 'react';
import CommunityPage from '../../components/CommunityPage/CommunityPage';
import ChatCard from '../../components/CommunityPage/sectionChat/chatSection';
import PrivacyInfo from '../../components/CommunityPage/sectionBenefits/PrivacyInfo';

const Community = () => {
  return (
    <main >
      <section >
        <CommunityPage />
        <ChatCard/>
        <PrivacyInfo/>
      </section>
    </main>
  );
};

export default Community;