import React from 'react';
import TriviaGame from '../components/TriviaGame';


import aboutImg1 from '../assets/about_img1.jpg';
import aboutImg2 from '../assets/about_img2.jpg';

function AboutPage() {
  return (
    <>
      <section className="page-title">
        <div className="container">
          <h1>About My Gaming Journey</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>What I Love About Valorant</h2>
          <div className="content-block">
            <div className="text-content">
              <p>Valorant is more than just a shooter; it's a chess match with guns. I specialize in playing Controllers, helping my team take space and control the map's geometry.</p>
              <p>My favorite map is Haven because of its unique three-site layout, which allows for dynamic rotations and creative strategies.</p>
            </div>
            <img src={aboutImg1} alt="Valorant aesthetic" />
          </div>
        </div>
      </section>

      <section className="section alt-bg">
        <div className="container">
          <h2>My League of Legends Experience</h2>
          <div className="content-block reverse">
            <div className="text-content">
              <p>League of Legends taught me the value of patience and macro-play. As a Support main, I focus on vision control and protecting my carries during team fights.</p>
              <p>The complexity of the game means there is always something new to learn, whether it's a new champion mechanic or a change in the item meta.</p>
            </div>
            <img src={aboutImg2} alt="League of Legends aesthetic" />
          </div>

          <blockquote className="quote">
            <p>"Competition is a by-product of productive work, not its goal. A creative man is motivated by the desire to achieve, not by the desire to beat others."</p>
            <cite>— Ayn Rand, The Moratorium on Brains</cite>
          </blockquote>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>My Gaming Timeline</h2>
          <ol className="timeline">
            <li><strong>2016:</strong> Started playing League of Legends as a complete beginner</li>
            <li><strong>2019:</strong> Stopped gaming at the moment and focused in academics</li>
            <li><strong>2020:</strong> Came out of my hiatus and began playing Valorant during beta release</li>               
            <li><strong>2022:</strong> Went on a hiatus again as my academics required more time to focus on</li>
            <li><strong>2025-Present:</strong> Came back and made both games as a way to relieve stress without neglecting my studies</li>
          </ol>
        </div>
      </section>

      { }
      <TriviaGame />
    </>
  );
}

export default AboutPage;