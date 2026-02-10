import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import TopServices from '@/components/home/TopServices';
import TopProviders from '@/components/home/TopProviders';
import ContactSection from '@/components/home/ContactSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <TopServices />
      <TopProviders />
      <ContactSection />
    </Layout>
  );
};

export default Index;
