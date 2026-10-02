import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const authorDoc = {
  _id: 'doc-inusha-thathsara-profile',
  _type: 'doc',
  title: 'About the Author: Malawige Inusha Thathsara Gunasekara',
  slug: {
    _type: 'slug',
    current: 'about-inusha-thathsara-gunasekara'
  },
  category: 'guides',
  description: 'Biography, background, technical expertise, and engineering portfolio of Malawige Inusha Thathsara Gunasekara.',
  tags: ['inusha', 'thathsara', 'gunasekara', 'linkedin', 'author', 'profile', 'biography', 'portfolio', 'moratuwa'],
  body: [
    {
      _key: 'b1',
      _type: 'block',
      style: 'h2',
      children: [{ _key: 's1', _type: 'span', text: 'Who is Inusha Thathsara Gunasekara?' }]
    },
    {
      _key: 'b2',
      _type: 'block',
      style: 'normal',
      children: [{
        _key: 's2',
        _type: 'span',
        text: 'Malawige Inusha Thathsara Gunasekara is a software engineer, AI researcher, and Information Technology undergraduate at the prestigious University of Moratuwa (UoM) in Colombo, Sri Lanka. He is an active technical writer on DEV.to (@inushathathsara) and builder specializing in Artificial Intelligence, Multi-Agent Systems, Full-Stack Web Development, and Flutter engineering.'
      }]
    },
    {
      _key: 'b3',
      _type: 'block',
      style: 'h2',
      children: [{ _key: 's3', _type: 'span', text: 'Key Achievements & Competition Wins' }]
    },
    {
      _key: 'b4',
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{
        _key: 's4',
        _type: 'span',
        text: '1st Place Winner at SLIIT CodeFest Datathon 2026: Architected an Enterprise Carbon & Climate Intelligence OS using Python, machine learning, and data science.'
      }]
    },
    {
      _key: 'b5',
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{
        _key: 's5',
        _type: 'span',
        text: 'Top 8 Finalist in Urban Flow AI Challenge: Engineered a high-throughput, end-to-end urban transit prediction platform handling over 48.6 million records with sub-gigabyte memory consumption.'
      }]
    },
    {
      _key: 'b6',
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{
        _key: 's6',
        _type: 'span',
        text: 'Built "The 80%" Attendance Companion: Developed a 15,000+ line Flutter production app with Google Gemini AI to parse university timetables and eliminate attendance friction.'
      }]
    },
    {
      _key: 'b7',
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [{
        _key: 's7',
        _type: 'span',
        text: 'Generative AI Innovations: Created an AI voice synthesizer and language translator for the game Planet of Lana, built multi-agent gift recommenders with Google ADK, and deployed Gemma 4:e4b vision apps.'
      }]
    },
    {
      _key: 'b8',
      _type: 'block',
      style: 'h2',
      children: [{ _key: 's8', _type: 'span', text: 'Technical Skills & Core Stack' }]
    },
    {
      _key: 'b9',
      _type: 'block',
      style: 'normal',
      children: [{
        _key: 's9',
        _type: 'span',
        text: 'Languages & Frameworks: Python, Flutter & Dart, Next.js, React, TypeScript, Node.js, GSAP, CSS Art. AI & Cloud: Google Gemini API, Google ADK, Gemma, Google Kubernetes Engine (GKE), Sanity CMS, Firebase, Docker.'
      }]
    },
    {
      _key: 'b10',
      _type: 'block',
      style: 'h2',
      children: [{ _key: 's10', _type: 'span', text: 'Connect & Learn More' }]
    },
    {
      _key: 'b11',
      _type: 'block',
      style: 'normal',
      children: [{
        _key: 's11',
        _type: 'span',
        text: 'LinkedIn: https://www.linkedin.com/in/inusha-gunasekara-9996632a5/ | DEV.to: https://dev.to/inushathathsara | GitHub: https://github.com/inusha-thathsara | Twitter/X: @InushaThathsara'
      }]
    }
  ]
};

async function run() {
  console.log('Publishing Author Bio to Sanity...');
  await client.createOrReplace(authorDoc);
  console.log('✓ Author profile successfully published to Sanity!');
}

run().catch(e => console.error(e.message));
