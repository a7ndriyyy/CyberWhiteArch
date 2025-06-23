import React from 'react';
import CommunityPage from '../../components/CommunityPage/CommunityPage';
import ChatCard from '../../components/CommunityPage/sectionCommunity/chatSection';

const Community = () => {
  return (
    <main >
      <section >
        <CommunityPage />
        <ChatCard/>
      </section>
    </main>
  );
};

export default Community;