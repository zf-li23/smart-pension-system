import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ElderForm from './pages/ElderForm';
import ProviderForm from './pages/ProviderForm';
import Results from './pages/Results';
import { Layout } from 'antd';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Layout className="layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <div className="demo-logo" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
            Smart Pension Match
          </div>
        </Header>
        <Content style={{ padding: '20px 50px', flex: 1 }}>
          <div style={{ background: '#fff', padding: 24, minHeight: '100%', borderRadius: '8px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/elder-form" element={<ElderForm />} />
              <Route path="/provider-form" element={<ProviderForm />} />
              <Route path="/results" element={<Results />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Smart Pension System ©2023</Footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
