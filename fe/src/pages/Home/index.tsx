import React from 'react';
import Navbar from '../../components/NavBar';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Your home page content goes here */}
        <h1 className="text-4xl font-bold text-gray-900">Welcome to FlavorFood</h1>
      </main>
    </div>
  );
};

export default Home;