// @ts-check

import { PROJECT_NARRATIVES } from "./project-narratives.js";

/**
 * Static one-time extraction from Andrew Zellinger's Notion portfolio gallery.
 * Captured 2026-09-03. This module must remain local static data: no runtime
 * Notion fetch, sync, API token, client connection, or public source link.
 *
 * Source manifest:
 * - audible-sleep: https://www.notion.so/3120ab715bfa8038b94bc65ec20b537b
 * - android-wear: https://www.notion.so/3120ab715bfa80d2b356c12f339a16e9
 * - fi-smart-collar: https://www.notion.so/3120ab715bfa8078a637f25f0feac01b
 * - wework-studio: https://www.notion.so/3120ab715bfa80adaa53de54842b599d
 * - foursquare: https://www.notion.so/3120ab715bfa8098bcece9291dadedbb
 * - live-auctioneers: https://www.notion.so/3120ab715bfa803bb3d5d2e6e229ab98
 * - proctor-and-gamble: https://www.notion.so/3120ab715bfa80af960ac943f7e9db02
 * - thompson-reuters: https://www.notion.so/3120ab715bfa802a8a8bea9f649183a3
 * - price-waterhouse-coopers: https://www.notion.so/3120ab715bfa802ea972f73a88ef858b
 * - avantos: https://www.notion.so/3120ab715bfa800083a1f4a7e7bb2bbb
 * - turner-tv: https://www.notion.so/3120ab715bfa808487d3f7b482e70ff4
 * - mcdonalds: https://www.notion.so/3120ab715bfa8089a477c83e25297527
 * - northwestern-mutual: https://www.notion.so/3120ab715bfa803b8e1fdc7aa518d651
 * - andrew-eccles: user-supplied project recollection; no Notion source supplied
 * - modern-age: user-supplied project recollection; no Notion source supplied
 * - pi-app: user-supplied project recollection; no Notion source supplied
 * - obagi: user-supplied project recollection; no Notion source supplied
 * - gero-app: user-supplied project recollection; no Notion source supplied
 */

/** @typedef {{ label: string, paragraphs: readonly string[] }} ProjectSection */
/** @typedef {{ client: string, studio: string, year: string, role: string }} ProjectMetadata */
/**
 * @typedef {object} ProjectRecord
 * @property {"project"} kind
 * @property {string} slug
 * @property {string} path
 * @property {"/"} collectionPath
 * @property {string} title
 * @property {string} headline
 * @property {ProjectMetadata} metadata
 * @property {readonly string[]} meta
 * @property {string} summary
 * @property {{ label: string }} media
 * @property {readonly ProjectSection[]} sections
 */

/** @type {ProjectRecord[]} */
const projectRecords = [
  {
    "kind": "project",
    "slug": "audible-sleep",
    "path": "/case-studies/audible-sleep/",
    "collectionPath": "/",
    "title": "Audible",
    "headline": "Audible Sleep, an immersive sleep solution.",
    "metadata": {
      "client": "Audible",
      "studio": "I&Co",
      "year": "2021",
      "role": "UX Lead"
    },
    "meta": [
      "Audible",
      "I&Co",
      "2021",
      "UX Lead"
    ],
    "summary": "The application uses sessions of audio content to help listeners develop healthier sleep behaviors and wake up experiences.",
    "media": {
      "label": "Audible Sleep screen array project image",
      "src": "/images/projects/audible-sleep-screen-array.png"
    },
    "sections": [
      {
        "label": "Introduction",
        "paragraphs": [
          "Audible, a leader in the audio industry, sought to expand beyond its vast selection of audiobooks by venturing into the sleep aid market. With the onset of the COVID-19 pandemic, the company recognized the growing importance of mental well-being and identified a gap in the market for sleep-related audio content. This led to the birth of the Sleep project, an initiative aimed at creating a digital solution to help users develop healthier sleep behaviors. To bring this vision to life, Audible partnered with I&Co, a Brooklyn-based design studio, to design and prototype a mobile application dedicated to sleep-related audio content.",
          "Role and Responsibilities:",
          "As the UX Lead for this project, I was responsible for developing the user experience design direction for the application. I worked closely with a team of 15 designers and product strategists to conduct UX research, brainstorm ideas, and create a functional and aesthetically pleasing prototype. My role involved overseeing the creation of wireframes, defining key interactions, and ensuring the design aligned with Audible's brand and user needs. Despite the fast-paced nature of the project, our team was able to deliver exceptional results that exceeded the client's expectations."
        ]
      },
      {
        "label": "Research",
        "paragraphs": [
          "The project began with a lean yet focused UX research phase. Understanding the user's needs and the subject matter was crucial to developing an effective solution. Our team collaborated with sleep specialists and scientists to gain insights into the problem space. Additionally, Audible provided significant market research that we leveraged to inform our design decisions.",
          "We created personas to represent different user types, focusing on their online behaviors, digital habits, and most importantly, their sleep patterns and behaviors. These personas guided our design process, ensuring that we addressed the needs and pain points of our target users."
        ]
      },
      {
        "label": "Ideation and Design Process",
        "paragraphs": [
          "Architecture:",
          "We started by establishing a high-level application architecture, considering both enrolled members and first-time users. We created flow diagrams and wireframes to outline the sign-up/sign-in process and divided the application into three key territories: Home, Browse, and Profile.",
          "Home:",
          "This territory served as a springboard environment, providing users with access to an array of cards that offered shortcuts to various audio content and required actions. Users could set up their experience by self-reporting their mood forecast status and specifying their bedtime and rise time to create a daily sleep session.",
          "Browse:",
          "This area allowed users to explore a comprehensive library of sleep-related audio content and generate unique sleep sessions based on their interests.",
          "Profile:",
          "This section enabled users to adjust and manage their settings, including personal information, payment details, and preferences.",
          "Card System:",
          "The in-app card system was a crucial aspect of the user experience, designed to provide users with quick access to different territories within the app and highlight featured and trending audio content. The UX team worked closely with the Visual Design team to ensure that the cards were not only visually appealing but also provided users with the contextual information needed to make informed decisions.",
          "Card Behaviors:",
          "We invested significant time in defining the various types of cards and their associated content. We established the logic for how the cards would behave and interact with each other, including how they would resolve upon tap and the navigation system for moving between cards. Ultimately, we implemented a carousel interaction to allow users to seamlessly navigate through the cards.",
          "Bedtime and Rise Time:",
          "Generating a custom sleep session began with users specifying their expected bedtime and rise time. This information was used to create personalized sleep sessions. Recognizing that users' schedules could fluctuate, we designed the application to allow daily adjustments to bedtime and rise time settings, ensuring each night's sleep session was tailored to the user's current needs.",
          "Mood Forecast:",
          "The \"Mood Forecast\" feature allowed users to self-report their expected mood for the current or following day, enabling the creation of personalized sleep sessions. Users could choose from a fixed array of mood options such as Stressful, Busy, Active, Mellow, and Quiet. This information was used to generate dynamic sleep sessions that supported users' anticipated states.",
          "Defining Player Actions:",
          "I focused on developing the audio and sleep session player, defining the necessary actions and information for each state. This included in-app play, lock screen play, and the modalities of Fall Asleep, Stay Asleep, and Rise. Key actions included Play/Pause, Next, End/Close Player, Complete Session, Replay, Scrub, and Volume. We identified the information to display at different points, such as Playback Progress, Track Duration, Track Name, Session Name, Category Name, Visuals, and Cover Art.",
          "Player Design:",
          "High-fidelity wireframes were created to design the key player states. The player was designed to be minimalistic, enabling users to interact with it only twice during a successful sleep session: to start and stop the session. The player featured simple controls for play, pause, stop, and track skipping, along with an ambient calming visualization. When users became inactive, the controls would disappear, transitioning the device to lock screen player mode.",
          "Lock Screen Player:",
          "The lock screen player allowed users to control the sleep session with limited options. Essential controls were included in the lock screen player menu button, enabling users to end the session directly from the lock screen."
        ]
      },
      {
        "label": "Testing and Validation",
        "paragraphs": [
          "After developing the prototype, we conducted extensive testing to ensure it met user needs and expectations. We performed usability testing with potential users to gather feedback on the application's functionality, design, and overall user experience. This feedback was invaluable in identifying areas for improvement and refining the design.",
          "We also collaborated closely with Audible's internal team to validate our design decisions and ensure alignment with their brand and business goals. Their insights helped us fine-tune the prototype and address any issues before moving to the final design and implementation phase."
        ]
      },
      {
        "label": "Final Design and Implementation",
        "paragraphs": [
          "The final design of the Sleep application was a testament to the hard work and dedication of our team. The application featured a user-friendly interface, intuitive navigation, and personalized sleep sessions that catered to users' individual needs. The card system, mood forecast feature, and minimalistic player design all contributed to a seamless and engaging user experience.",
          "Our collaboration with Audible's design and development teams ensured that the final product was not only visually appealing but also technically feasible. The integration of sleep-related audio content into the primary Audible application helped reinforce the brand and provide users with a cohesive experience."
        ]
      },
      {
        "label": "Outcomes and Results",
        "paragraphs": [
          "The Sleep project was a resounding success. The final product received positive feedback from both Audible's internal team and end users. Key outcomes included:",
          "• Improved User Experience: The application's intuitive design and personalized sleep sessions helped users develop healthier sleep behaviors and improve their overall well-being.",
          "• Brand Reinforcement: By integrating sleep-related audio content into the primary Audible application, the project reinforced Audible's brand and expanded its service offering.",
          "• User Engagement: The application saw high levels of user engagement, with many users reporting that the sleep sessions helped them fall asleep faster and wake up feeling more rested.",
          "• Market Differentiation: The Sleep project positioned Audible as a leader in the sleep aid market, differentiating it from competitors and attracting new users."
        ]
      },
      {
        "label": "Lessons and Reflections",
        "paragraphs": [
          "The Sleep project provided valuable lessons and insights that can be applied to future UX design projects:",
          "• Collaboration is Key: Working closely with Audible's internal team and leveraging their market research and expertise was crucial to the project's success. Collaboration between designers, product strategists, and developers ensured a cohesive and well-rounded final product.",
          "• User-Centered Design: Understanding users' needs and behaviors through personas and user testing was essential in creating a product that truly met their needs. Keeping the user at the center of the design process led to a more effective and engaging application.",
          "• Flexibility and Adaptability: The ability to adjust the design based on user feedback and changing requirements was critical. Flexibility in the design process allowed us to address issues and refine the application to better serve users.",
          "• Attention to Detail: Every aspect of the design, from the card system to the player interactions, required careful consideration and attention to detail. Ensuring that all elements worked seamlessly together resulted in a polished and user-friendly final product."
        ]
      },
      {
        "label": "Conclusion",
        "paragraphs": [
          "The Sleep project was a remarkable journey that demonstrated the power of collaboration, user-centered design, and attention to detail. By creating a digital sleep solution that helped users develop healthier sleep behaviors, we were able to reinforce Audible's brand and expand its service offering in a meaningful way. The success of the project is a testament to the hard work and dedication of the entire team, and the lessons learned will undoubtedly inform future UX design endeavors.",
          "As the UX Lead, I am proud of the work we accomplished and the positive impact the Sleep application has had on users' lives. The integration of sleep-related audio content into the primary Audible application has provided users with a valuable tool to improve their well-being and demonstrated Audible's commitment to innovation and user experience."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "android-wear",
    "path": "/case-studies/android-wear/",
    "collectionPath": "/",
    "title": "Google",
    "headline": "Pioneering Smartwatch Face Design for Wear OS",
    "metadata": {
      "client": "Google",
      "studio": "ustwo",
      "year": "2017",
      "role": "UI/UX Design"
    },
    "meta": [
      "Google",
      "ustwo",
      "2017",
      "UI/UX Design"
    ],
    "summary": "A groundbreaking collaboration between ustwo and Google's Wear OS team revolutionized watch face design and development, setting a new standard for smart watch face user experiences more broadly.",
    "media": {
      "label": "Android Wear watch face array project image",
      "src": "/images/projects/android-wear-array.png"
    },
    "sections": [
      {
        "label": "Introduction",
        "paragraphs": [
          "In March 2014, Google introduced Wear OS, a new version of Android specifically designed for wearable devices. With the impending release of smartwatches powered by Wear OS, Google sought a design partner to develop an array of smartwatch faces that would serve as visual and functional extensions of the operating system. They reached out to Ustwo, a renowned design studio, to help establish best practices and create a collection of watch faces. The primary challenge was to design smartwatch faces that not only complemented Wear OS but also enhanced the user experience by being intuitive, customizable, and visually appealing. This involved understanding the unique constraints and opportunities presented by wearable devices and translating that into compelling designs. The project's primary goal was to create a diverse set of smartwatch faces that would be showcased at Google’s annual developer conference and later released alongside the new Wear OS Watch Face API. Objectives included:",
          "• Developing designs that are both functional and visually captivating.",
          "• Ensuring high glanceability and ease of use.",
          "• Facilitating user customization.",
          "• Documenting the design process to establish guidelines."
        ]
      },
      {
        "label": "My Role and Responsibilities",
        "paragraphs": [
          "Team:",
          "The project team consisted of five designers, including myself, working alongside engineers, project managers, and Google's developer relations team.",
          "Responsibilities:",
          "• Conducting initial research to understand the Wear OS platform and its user base.",
          "• Creating and iterating on design concepts.",
          "• Developing wireframes and interactive prototypes.",
          "• Collaborating with engineers to ensure the designs were feasible and optimized for different screen modalities.",
          "• Testing designs and refining them based on user feedback.",
          "• Documenting the design process and contributing to the creation of the Wear OS smartwatch face design guidelines."
        ]
      },
      {
        "label": "Research",
        "paragraphs": [
          "User Research:",
          "Our research phase aimed to gain a deep understanding of the Wear OS platform and user needs. This included:",
          "Platform Analysis:",
          "Studying Wear OS’s capabilities, limitations, and potential use cases.",
          "User Personas:",
          "Developing personas representing various user segments, from tech enthusiasts to fitness buffs.",
          "Market Analysis:",
          "Reviewing existing smartwatch faces and identifying gaps and opportunities for innovation.",
          "Key insights from our research included:",
          "• Glanceability: Users needed to access information quickly and effortlessly.",
          "• Customization: Personalization was crucial, as users wanted their smartwatch faces to reflect their individual styles and preferences.",
          "• Data Integration: Users valued watch faces that provided meaningful, real-time data, such as fitness metrics or weather updates.",
          "Based on our research, we developed detailed personas:",
          "• Tom: A tech enthusiast who values cutting-edge design and customization.",
          "• Fiona: A fitness-oriented user who needs real-time data on her workouts and health metrics.",
          "• Peter: A professional who requires at-a-glance information and a sleek, understated design."
        ]
      },
      {
        "label": "Ideation and Design Process",
        "paragraphs": [
          "Brainstorming and Sketching:",
          "We began with brainstorming sessions to generate a wide range of ideas. Each designer sketched multiple concepts, focusing on innovative ways to display time and integrate data.",
          "Wireframes and Prototypes:",
          "• Wireframes: We created low-fidelity wireframes to outline the basic structure and functionality of each watch face.",
          "• Interactive Prototypes: High-fidelity prototypes were developed to simulate the user experience and test interactions.",
          "• Design Iterations: Our design process was iterative and collaborative. We continuously tested and refined our concepts based on feedback from both internal reviews and user testing sessions."
        ]
      },
      {
        "label": "Key Designs",
        "paragraphs": [
          "Rift watch face:",
          "This watch face featured 60 spikes extending from the edges, representing minutes. The spikes shifted in color from lavender to fuchsia to indicate seconds. This design emphasized the passage of time in a visually striking manner.",
          "Waves watch face:",
          "A grid of squares flipped to reveal underlying colors, creating a dynamic, ever-changing display. Users could customize the color themes, making it a highly personalized option.",
          "Versus watch face:",
          "Integrated fitness data within the watch face, allowing users to track their step count and other metrics at a glance. The design focused on simplicity and clarity to ensure that data was easily digestible."
        ]
      },
      {
        "label": "Testing and Validation",
        "paragraphs": [
          "Usability Testing:",
          "We conducted usability tests with a diverse group of users to validate our designs. Participants were asked to complete specific tasks while interacting with the watch faces, and we gathered feedback on ease of use, visual appeal, and overall experience.",
          "Feedback and Insights:",
          "• Positive Feedback: Users appreciated the unique and engaging designs. The customization options were particularly well-received.",
          "• Areas for Improvement: Some users found certain elements confusing or difficult to read in different lighting conditions. There were also requests for additional customization features.",
          "• Iterations Based on Feedback: We made several refinements based on user feedback:",
          "• Enhanced Readability: Adjusted color contrasts and font sizes to improve readability in various lighting conditions.",
          "• Additional Customization: Added more options for users to personalize their watch faces, including different themes and data displays."
        ]
      },
      {
        "label": "Final Design and Implementation",
        "paragraphs": [
          "Final Design:",
          "The final collection included 20 unique watch faces, divided into two sets: Digital Styles: Designs that emphasized visual flair and dynamic movements, such as Rift and Waves. Data-Integrated Faces: Designs like Versus that incorporated real-time data in a clear and user-friendly manner.",
          "Implementation:",
          "We collaborated closely with Google's engineering team to ensure our designs were accurately implemented.",
          "This involved:",
          "• Regular check-ins and design reviews.",
          "• Testing on various smartwatch models to ensure compatibility and performance.",
          "• Refining interactions and animations to optimize the user experience."
        ]
      },
      {
        "label": "Outcomes and Results",
        "paragraphs": [
          "Metrics and KPIs:",
          "Post-launch, we tracked several key metrics to measure the success of our designs:",
          "User Adoption:",
          "The new watch faces were widely adopted, with thousands of downloads within the first week.",
          "User Engagement:",
          "Positive feedback and high engagement levels indicated that users enjoyed the new designs and found them useful.",
          "Customization Usage:",
          "Data showed that users frequently utilized the customization options, validating the importance of this feature.",
          "User Feedback:",
          "The feedback from users was overwhelmingly positive. They praised the visual appeal, ease of use, and customization options of the new watch faces.",
          "Business Impact:",
          "The successful launch of the new watch faces strengthened Google’s Wear OS platform, attracting more users and developers. It also showcased Ustwo’s design capabilities, leading to further collaborations with Google."
        ]
      },
      {
        "label": "Lessons Learned and Reflections",
        "paragraphs": [
          "Challenges we faced:",
          "• Balancing Innovation and Usability: Ensuring our designs were both innovative and user-friendly was a significant challenge.",
          "• Technical Constraints: Working within the technical constraints of the Wear OS platform required creative problem-solving and close collaboration with engineers.",
          "What I learned:",
          "• User-Centered Design: The importance of involving users throughout the design process to ensure the final product meets their needs.",
          "• Iterative Process: The value of continuous testing and iteration to refine and improve designs.",
          "Collaboration:",
          "The necessity of strong collaboration between designers, engineers, and stakeholders to achieve successful outcomes.",
          "Future improvements:",
          "• Continuous Improvement: Regular updates and new features to keep the watch faces fresh and engaging.",
          "• Expanded Customization: Offering even more customization options to cater to a wider range of user preferences."
        ]
      },
      {
        "label": "Conclusion",
        "paragraphs": [
          "The Wear OS smartwatch face project was a landmark collaboration between Ustwo and Google, resulting in innovative and engaging designs that set a new standard for smartwatch user experiences. The success of the project was a testament to the power of user-centered design, iterative processes, and strong collaboration. The lessons learned and the guidelines developed will continue to influence future smartwatch face designs, ensuring that Wear OS remains a leading platform for wearable technology.",
          "Reflecting on this project, it stands out as one of the most inspiring and rewarding experiences of my career. The dedication, creativity, and teamwork that went into creating these watch faces were truly exceptional, and I am proud to have been part of such a pioneering effort. The Wear OS smartwatch face project not only pushed the boundaries of design but also reinforced the importance of a user-focused approach in creating meaningful and impactful products."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "fi-smart-collar",
    "path": "/case-studies/fi-smart-collar/",
    "collectionPath": "/",
    "title": "Fi",
    "headline": "Enhancing Dog Tracking",
    "metadata": {
      "client": "Fi",
      "studio": "Independent",
      "year": "2023",
      "role": "Design Lead"
    },
    "meta": [
      "Fi",
      "Independent",
      "2023",
      "Design Lead"
    ],
    "summary": "Paired with a Fi collar, the Fi app brings you even closer to your dog. View your dog's location and activity levels on the app and be alerted if they ever escape.",
    "media": {
      "label": "Fi Smart Collar app screen array project image",
      "src": "/images/projects/fi-screen-array.png"
    },
    "sections": [
      {
        "label": "Introduction",
        "paragraphs": [
          "Fi is a leading company in the pet tech industry, offering a smart dog collar and a corresponding mobile application. This system allows dog owners to track their pet’s GPS location and vitals, providing peace of mind and a deeper connection with their furry friends. In 2023, I had the opportunity to work with Fi to design a variety of new app features and marketing materials to enhance the user experience and promote the product.",
          "The primary challenge was to introduce new in-app features that leveraged advancements in GPS tracking technology, improve the subscription model and checkout flow, and develop new social features for dog owners. The goal was to enrich the Fi app's functionality while ensuring a seamless and enjoyable user experience."
        ]
      },
      {
        "label": "Role and Responsibilities",
        "paragraphs": [
          "As the Design Lead, I was responsible for overseeing the design and implementation of new app features, website improvements, and marketing materials. Given the team’s recent layoffs, I took on an extensive range of responsibilities typically spread across a larger team. This included user research, wireframing, prototyping, user interface design, and collaboration with engineers and stakeholders. My role extended beyond the app to influence the corporate website and promotional content, ensuring a cohesive and engaging brand presence."
        ]
      },
      {
        "label": "Research",
        "paragraphs": [
          "User Research: To kick off the project, I conducted thorough research to understand the needs and behaviors of Fi’s target audience. This included:",
          "• User Interviews: Speaking with existing Fi users to gather insights on their experiences, pain points, and desired features.",
          "• Competitive Analysis: Evaluating other pet tech products to identify strengths and weaknesses in the market.",
          "• Surveys: Distributing surveys to a broader audience to validate findings and uncover additional insights."
        ]
      },
      {
        "label": "Findings",
        "paragraphs": [
          "Key findings from the research phase included:",
          "• Importance of Real-Time Tracking: Users prioritized accurate, real-time tracking to ensure their dogs' safety.",
          "• Customization and Personalization: There was a strong desire for personalized features, such as breed-specific information and customizable alerts.",
          "• Community Features: Many users expressed interest in social features that would allow them to connect with other dog owners."
        ]
      },
      {
        "label": "Personas",
        "paragraphs": [
          "Based on the research, I developed detailed personas representing various segments of Fi's user base:",
          "• Caring Catherine: A dedicated pet owner who values real-time tracking and health monitoring for her senior dog.",
          "• Active Adam: An outdoor enthusiast who wants to track his dog's activity levels and ensure its safety during hikes.",
          "• Social Sarah: A dog lover interested in connecting with other pet owners and sharing experiences."
        ]
      },
      {
        "label": "Ideation and Design Process",
        "paragraphs": [
          "Brainstorming and Sketching:",
          "Our design process began with brainstorming sessions to generate ideas for new features and improvements. I facilitated workshops with stakeholders to align on priorities and explore different concepts. Initial sketches helped visualize these ideas and set the direction for more detailed designs.",
          "Wireframes and Prototypes:",
          "I developed wireframes to outline the structure and functionality of the new features. These wireframes served as a blueprint for high-fidelity prototypes, which I created to simulate the user experience and test interactions. Prototyping tools like Figma allowed for easy collaboration and iteration."
        ]
      },
      {
        "label": "Key Design Initiatives",
        "paragraphs": [
          "Breed-Specific Landing Pages:",
          "To create a more personalized experience, we designed breed-specific landing pages on the Fi website. These pages provided tailored information and targeted dog owners by breed, enhancing engagement and conversion rates.",
          "Lost Dog Mode:",
          "Improvements to the \"Lost Dog Mode\" flow were crucial. This feature alerts users when their dog breaches a safe zone and allows them to track their dog's live GPS location. I worked closely with engineers to leverage new GPS advancements, ensuring the interface was clear and easy to use.",
          "Testimonials:",
          "Post-recovery feedback was essential for continuous improvement. We designed a flow to solicit user feedback after their dog was retrieved, ensuring we captured insights to enhance the \"Lost Dog Mode\" feature and gather testimonials.",
          "Subscriptions and Checkout:",
          "The subscription model and checkout flow needed an overhaul to improve user experience and drive sales. I led brainstorming sessions and stakeholder interviews to redesign these processes, focusing on clarity and ease of use.",
          "Sharing Profiles:",
          "We introduced a feature that enabled users to share and add dog profiles in real-time. This allowed dog owners to connect and follow each other's dogs' activities, fostering a sense of community.",
          "Referrals:",
          "To promote growth, we designed a referral system where users could share referral codes with friends. This feature included tracking successful referrals and offering rewards, encouraging users to spread the word about Fi."
        ]
      },
      {
        "label": "Testing and Validation",
        "paragraphs": [
          "Usability Testing:",
          "We conducted usability tests with a diverse group of users to validate our designs. Participants were asked to complete specific tasks within the app, and we gathered feedback on ease of use, visual appeal, and overall experience."
        ]
      },
      {
        "label": "Feedback and Insights",
        "paragraphs": [
          "The testing phase provided valuable insights:",
          "• Positive Feedback: Users appreciated the new features and the app’s improved usability.",
          "• Areas for Improvement: Some users found certain elements confusing or difficult to navigate. There were also requests for additional customization options."
        ]
      },
      {
        "label": "Iterations Based on Feedback",
        "paragraphs": [
          "Based on user feedback, we made several refinements:",
          "• Enhanced Navigation: Improved the app’s navigation to make it more intuitive.",
          "• Additional Customization: Added more options for users to personalize their experience.",
          "• Clearer Instructions: Provided clearer instructions and tooltips to guide users through new features."
        ]
      },
      {
        "label": "Final Design and Implementation",
        "paragraphs": [
          "Final Design:",
          "The final design incorporated all the new features and improvements, creating a cohesive and user-friendly experience. Key elements included:",
          "• Breed-Specific Pages: Personalized landing pages that provided relevant information and targeted content.",
          "• Enhanced Lost Dog Mode: A clearer and more effective interface for tracking lost dogs.",
          "• Subscription and Checkout Flow: Simplified and streamlined processes that improved conversion rates.",
          "• Community Features: Sharing profiles and referral systems that fostered connections among dog owners."
        ]
      },
      {
        "label": "Implementation",
        "paragraphs": [
          "I worked closely with Fi’s engineering team to ensure the designs were implemented accurately. This involved regular check-ins, design reviews, and testing on various devices to ensure compatibility and performance."
        ]
      },
      {
        "label": "Outcomes and Results",
        "paragraphs": [
          "Metrics and KPIs:",
          "Post-launch, we tracked several key metrics to measure the success of our designs:",
          "• User Adoption: Increased adoption rates for the new features.",
          "• User Engagement: High engagement levels with the app’s new functionalities.",
          "• Conversion Rates: Improved conversion rates for subscriptions and collar purchases.",
          "User Feedback:",
          "The feedback from users was overwhelmingly positive. They praised the app’s new features, ease of use, and the ability to personalize their experience. The community features were particularly well-received, fostering a sense of connection among dog owners.",
          "Business Impact:",
          "The successful launch of the new features strengthened Fi’s market position and attracted more users. The improvements to the subscription and checkout flow boosted sales, while the referral system promoted organic growth."
        ]
      },
      {
        "label": "Lessons Learned and Reflections",
        "paragraphs": [
          "Challenges Faced:",
          "• Balancing Innovation and Usability: Ensuring the new features were both innovative and user-friendly was a significant challenge.",
          "• Technical Constraints: Working within the technical constraints of the Fi platform required creative problem-solving and close collaboration with engineers.",
          "• Stakeholder Alignment: Achieving consensus among various stakeholders was essential to move forward with the design initiatives.",
          "What I Learned:",
          "• User-Centered Design: The importance of involving users throughout the design process to ensure the final product meets their needs.",
          "• Iterative Process: The value of continuous testing and iteration to refine and improve designs.",
          "• Collaboration: The necessity of strong collaboration between designers, engineers, and stakeholders to achieve successful outcomes.",
          "Future Improvements:",
          "• Continuous Improvement: Regular updates and new features to keep the app fresh and engaging.",
          "• Expanded Customization: Offering even more customization options to cater to a wider range of user preferences.",
          "• Enhanced Community Features: Further developing social features to foster a stronger sense of community among users."
        ]
      },
      {
        "label": "Conclusion",
        "paragraphs": [
          "The Fi app project was a comprehensive and rewarding experience that showcased the power of user-centered design and strong collaboration. The new features and improvements not only enhanced the user experience but also strengthened Fi’s market position and drove growth. Reflecting on this project, it stands out as a significant achievement in my career, demonstrating the impact of thoughtful design and continuous iteration. The lessons learned and insights gained will undoubtedly influence my future work, ensuring I continue to create meaningful and impactful products."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "wework-studio",
    "path": "/case-studies/wework-studio/",
    "collectionPath": "/",
    "title": "WeWork",
    "headline": "Sales tool for business growth",
    "metadata": {
      "client": "WeWork",
      "studio": "Philosophie",
      "year": "2020",
      "role": "Design Director"
    },
    "meta": [
      "WeWork",
      "Philosophie",
      "2020",
      "Design Director"
    ],
    "summary": "WeWork, a global company offering flexible shared office spaces for entrepreneurs, startups, freelancers, and other professionals, faced a unique challenge.",
    "media": {
      "label": "WeWork Studio sales tool project image",
      "src": "/images/projects/wework-screen.png"
    },
    "sections": [
      {
        "label": "Introduction",
        "paragraphs": [
          "WeWork, a global company offering flexible shared office spaces for entrepreneurs, startups, freelancers, and other professionals, faced a unique challenge. Their rapid expansion and acquisition of new commercial real estate properties were outpacing their ability to secure new tenants. To address this, WeWork sought the expertise of product design consultancy Philosophie to prototype a sales tool application. This tool aimed to streamline the sales process, enabling WeWork’s sales team to effectively communicate the advantages and amenities of being a WeWork tenant."
        ]
      },
      {
        "label": "My Role and Responsibilities",
        "paragraphs": [
          "As the Design Director at Philosophie, I led the design team in this ambitious project. My responsibilities included:",
          "• Leading the user experience (UX) and user interface (UI) design direction.",
          "• Overseeing the creation of high-fidelity wireframes and interactive prototypes.",
          "• Collaborating with WeWork’s internal design and product teams to ensure brand consistency.",
          "• Managing a team of three designers, a product manager, and an engineering resource.",
          "• Facilitating user research and testing phases to gather feedback and refine the prototype."
        ]
      },
      {
        "label": "Research",
        "paragraphs": [
          "The Sales Pitch Evaluation: We began by evaluating the oral pitch and in-person walkthroughs that WeWork sales team members delivered to potential tenants. This assessment aimed to identify pain points and areas for improvement that could be addressed by the sales tool. We conducted interviews with sales team members at different levels of seniority to gain valuable insights into their workflow, communication styles, and the challenges they faced.",
          "Key Findings:",
          "• Varied Pitch Styles: Sales team members had different levels of experience, personalities, and communication styles, resulting in unique pitch processes.",
          "• Complexity and Length: Some team members struggled with the length and complexity of the pitch, making it difficult to remember all key points and benefits.",
          "• Client Information: Sales team members often lacked sufficient information about potential clients before the pitch, hindering their ability to tailor the presentation to specific needs.",
          "• Technology Integration: The use of existing technology and tools by the sales team was inconsistent, indicating potential integration points for the new sales tool."
        ]
      },
      {
        "label": "Ideation and Design Process",
        "paragraphs": [
          "Defining Navigation:",
          "Understanding the problem space and user needs, we developed a navigation schema for the sales tool application. Considering the application would typically be used in a conference room setting on a tablet or large touchscreen device, we prioritized accessibility standards and design best practices. The main navigation menu was strategically placed to ensure easy and intuitive navigation.",
          "User Flow Development:",
          "Our next step was to envision a user flow that could adapt to the requirements of all sales team members, regardless of their personal pitch styles. We brainstormed critical features and assets that should be included in the application, focusing on creating an intuitive user experience. Interactive elements like videos and animations were considered to make the content more engaging.",
          "Wireframing:",
          "After agreeing on the user flow and design direction, we created high-fidelity wireframes to provide a detailed representation of the application's interface. These wireframes showcased different features and functions, allowing us to visualize and refine the user experience. We also developed various design concepts and visual assets, such as typography, color, and iconography.",
          "Incorporating WeWork Design:",
          "WeWork’s internal design and product teams provided substantial design guidelines and supporting media assets, including typography, color palette, photography, videos, and virtual walkthroughs of the physical space in both 3D and 2D formats. These high-quality assets informed our design decisions, ensuring consistency with the WeWork brand."
        ]
      },
      {
        "label": "Testing and Validation",
        "paragraphs": [
          "Diary Study:",
          "To validate our design, we distributed the prototype application to several sales team members and conducted a diary study. The project’s product owner, Chase, administered a series of questionnaires to gather incremental feedback on their experiences using the prototype. This feedback was crucial in refining the application and ensuring it met the sales team’s needs."
        ]
      },
      {
        "label": "Final Design and Implementation",
        "paragraphs": [
          "Rapid Prototype:",
          "Our design team worked efficiently to deliver a rapid prototype of the application in just under four months. Despite the relatively small team allocated to this project, we created a high-fidelity design that was visually appealing, user-friendly, and intuitive for the sales team members to use. The final prototype application was simplistic yet powerful, meeting the sales team’s needs and enhancing their ability to communicate WeWork’s benefits to potential clients.",
          "Virtual Touring:",
          "The design team was tasked with creating a streamlined interface for navigating virtual assets, including 2D floorplans, 3D renders, and virtual walkthroughs produced by Archaeologic, a technology company later acquired by WeWork. We opted for a minimalistic approach, allowing the stunning render assets to take center stage while providing essential controls for navigation.",
          "Search and Discovery:",
          "We designed a simple and intuitive search interface that prompts users to enter their preferred location. Leveraging design patterns from the main WeWork website, users could search for WeWork spaces based on geolocation and building type. A new map feature was introduced, helping users visualize their search results on a location-specific map, making it easier to find a suitable WeWork space."
        ]
      },
      {
        "label": "Outcomes and Results",
        "paragraphs": [
          "Successful Prototype:",
          "The prototype application received positive feedback from the sales team members during the diary study. They found the tool user-friendly, engaging, and effective in communicating WeWork’s benefits. The flexibility of the user flow and the integration of high-quality visual assets significantly enhanced their pitch process.",
          "Enhanced Sales Workflow:",
          "The sales tool improved the overall workflow of the sales team by providing a centralized platform to access all necessary information and assets. It allowed sales representatives to tailor their pitch to potential clients more effectively, leading to better client interactions and higher conversion rates.",
          "Improved Client Engagement:",
          "The interactive elements, such as videos and virtual walkthroughs, made the pitch process more engaging and memorable for potential clients. The application’s intuitive design and ease of use also contributed to a more positive client experience."
        ]
      },
      {
        "label": "Lessons Learned and Reflections",
        "paragraphs": [
          "Importance of Flexibility:",
          "One of the key lessons learned was the importance of flexibility in designing a sales tool. By accommodating different pitch styles and allowing for personalization, we were able to create a tool that met the diverse needs of the sales team.",
          "Collaboration and Communication:",
          "Close collaboration and communication with WeWork’s internal design and product teams were crucial to the project’s success. Their insights and feedback helped us maintain brand consistency and ensure the application met their standards.",
          "Value of User Feedback:",
          "The diary study and user feedback were invaluable in refining the prototype. Understanding the sales team’s real-world experiences and pain points allowed us to make informed design decisions and create a tool that truly addressed their needs."
        ]
      },
      {
        "label": "Conclusion",
        "paragraphs": [
          "The WeWork sales tool project was a resounding success, achieved by a small but dedicated team. As the Design Director, I am proud of the work we accomplished and the positive impact it had on WeWork’s sales process. The project demonstrated the importance of flexibility, collaboration, and user feedback in creating a successful UX product. The final sales tool application not only improved the sales team’s workflow but also enhanced client engagement, ultimately contributing to WeWork’s growth and success in securing new tenants."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "foursquare",
    "path": "/case-studies/foursquare/",
    "collectionPath": "/",
    "title": "Foursquare",
    "headline": "Rebranding Foursquare",
    "metadata": {
      "client": "Foursquare",
      "studio": "Red Antler",
      "year": "2014",
      "role": "Brand Design"
    },
    "meta": [
      "Foursquare",
      "Red Antler",
      "2014",
      "Brand Design"
    ],
    "summary": "Foursquare was splitting in two. The product that had defined location-based social networking — the check-in — was migrating to a new app called Swarm, and Foursquare itself was pivoting to become a personalized local discovery platform.",
    "media": {
      "label": "Foursquare branding project image",
      "src": "/images/projects/foursquare-branding.png"
    },
    "sections": [
      {
        "label": "Context",
        "paragraphs": [
          "Foursquare was splitting in two. The product that had defined location-based social networking — the check-in — was migrating to a new app called Swarm, and Foursquare itself was pivoting to become a personalized local discovery platform. The company needed a new identity that signaled this shift clearly. Co-founder Dennis Crowley brought in Red Antler to collaborate on the rebrand and navigate the product transition. The stakes were high — Foursquare had to shed years of brand equity tied to check-ins and re-emerge as something fundamentally different, without losing recognition."
        ]
      },
      {
        "label": "What I Did",
        "paragraphs": [
          "I worked with the Red Antler team to generate brand assets and materials for the new Foursquare identity. This was production-intensive brand design work — taking the strategic direction and the new visual language and building it out across the full system of touchpoints. The new identity centered on a superhero-style \"F\" monogram that doubled as a map pin — a mark that had to work as an app icon at 16x16 pixels and hold up alongside the Facebooks and Twitters of the world. The brand palette shifted to a bold blue-pink-white combination meant to signal creativity and energy, a departure from the original's playfulness."
        ]
      },
      {
        "label": "The Work",
        "paragraphs": [
          "The rebrand was an exercise in compression. Everything about Foursquare's new identity had to boil down to a single mark — the \"F\" emblem — that simultaneously read as a flag, a superhero badge, and a speech bubble depending on context. The brand assets extended across the app, marketing materials, and the broader visual system. The process was heavily collaborative and iterative with Foursquare's internal team. Early concepts explored evolutions of the existing brand, but the scale of the product change demanded something that felt new rather than updated. The app was always the primary canvas — every brand decision was tested against how it would feel in someone's hand on a phone screen."
        ]
      },
      {
        "label": "What Happened",
        "paragraphs": [
          "The new identity launched in July 2014 alongside the overhauled Foursquare app and the separate Swarm release. It was widely covered across the design press — Brand New, Designboom, VentureBeat, Design Week — and became one of the more talked-about rebrands of that year. The mark held up. Foursquare successfully transitioned its public perception from a check-in app to a discovery platform, and the \"F\" emblem became instantly recognizable in the app ecosystem."
        ]
      },
      {
        "label": "Reflections",
        "paragraphs": [
          "This was one of those projects where you're building the assets that millions of people will see on their home screen. The pressure of working at that scale — getting a mark right at 16 pixels — teaches you something about restraint that most design work doesn't. You can't hide behind complexity when the canvas is that small."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "live-auctioneers",
    "path": "/case-studies/live-auctioneers/",
    "collectionPath": "/",
    "title": "Live Auctioneers",
    "headline": "Live Auctioneers, connecting buyers with live auctions.",
    "metadata": {
      "client": "Live Auctioneers",
      "studio": "Independent",
      "year": "2022",
      "role": "Design Lead"
    },
    "meta": [
      "Live Auctioneers",
      "Independent",
      "2022",
      "Design Lead"
    ],
    "summary": "The company has continued to grow and acquire new properties, all supported by a single core design system.",
    "media": {
      "label": "Live Auctioneers website project image",
      "src": "/images/projects/liveauctioneers-screen.png"
    },
    "sections": [
      {
        "label": "Introduction",
        "paragraphs": [
          "Live Auctioneers is a premier online platform that connects buyers with live global auctions, offering a wide range of items, including art, collectibles, jewelry, and more. The platform provides real-time bidding, high-quality photos and descriptions, and the ability to place bids from anywhere in the world. As the company grew and acquired new properties, it became apparent that a unified design system was necessary to maintain consistency across all platforms and streamline future work for internal design and development teams. This case study details the journey of creating and implementing a robust design system for Live Auctioneers."
        ]
      },
      {
        "label": "Role and Responsibilities",
        "paragraphs": [
          "As the Design Lead, I was brought on as a consultant to manage a small team of designers tasked with building the design system. I collaborated closely with key internal stakeholders from product and engineering organizations. My responsibilities included auditing the existing design system, establishing a framework for the new system, and building out an atomic design system across Figma and Storybook. Additionally, I ensured that all components were documented comprehensively, facilitating seamless implementation and maintenance."
        ]
      },
      {
        "label": "Research",
        "paragraphs": [
          "Initial Audit:",
          "The project began with a thorough audit of the existing design language and implementation processes. The design team conducted a detailed inspection of the components in use, identifying inconsistencies and inefficiencies. This audit extended to the engineering team's processes, revealing gaps in documentation and the inconsistent application of design principles.",
          "Tools and Processes:",
          "Many legacy design files were created in Sketch, but the team had since migrated to Figma. However, we discovered that components were not consistently built using Figma best practices, such as auto layout. Concurrently, the engineering team had been rebuilding components in Storybook, often without proper documentation or consistency. These findings underscored the need for a comprehensive and cohesive design system."
        ]
      },
      {
        "label": "Ideation and Design Process",
        "paragraphs": [
          "Product Audit:",
          "Separately, our team audited the product build of both the website and native mobile application. This evaluation highlighted how components worked together and where significant inconsistencies existed. We documented these findings, identifying pain points within the current user experience. This documentation informed the creation of a project roadmap, prioritizing objectives and setting the stage for the design system's development.",
          "Establishing the Atomic Design System:",
          "With the project roadmap in place, we began designing the atomic design system. This approach breaks down the design system into its smallest components, ensuring each element is reusable and consistent. The foundational elements included:",
          "• Color: Defining primary, secondary, and tertiary color palettes.",
          "• Typography: Establishing font styles, sizes, and hierarchies.",
          "• Grid System: Creating a flexible and responsive grid layout.",
          "• Spacing: Standardizing margins and paddings.",
          "• Modal and Status Badges: Designing common UI components and states.",
          "Documentation and Collaboration:",
          "Collaboration between the design and development teams was crucial. We created comprehensive written documentation for each component type, explaining intended usage and addressing edge cases. This documentation lived in Figma and Storybook, ensuring all team members had access to the single source of truth."
        ]
      },
      {
        "label": "Testing and Validation",
        "paragraphs": [
          "Usability Testing:",
          "We conducted usability testing with internal stakeholders and end-users to validate the design system's effectiveness. This testing phase was critical in identifying any issues or areas for improvement before full implementation. Feedback was gathered and iterated upon, refining the design system to better meet user needs and expectations.",
          "Cross-Platform Consistency:",
          "Ensuring consistency across web and mobile platforms was a significant focus. The design system was tested in various environments to confirm that components behaved as expected. This cross-platform consistency was vital in providing a seamless user experience, regardless of the device used."
        ]
      },
      {
        "label": "Final Design and Implementation",
        "paragraphs": [
          "Building the System:",
          "The final design system featured over 500 unique components, each documented and built out in Figma and Storybook. This robust system provided a foundation for future design and development work, streamlining processes and reducing the potential for inconsistencies.",
          "Implementation:",
          "The implementation phase involved close collaboration with the engineering team to integrate the design system into the existing product infrastructure. Regular check-ins and reviews ensured that the components were implemented correctly and functioned as intended."
        ]
      },
      {
        "label": "Outcomes and Results",
        "paragraphs": [
          "The new design system yielded several positive outcomes:",
          "• Improved Efficiency: The unified design system streamlined the design and development process, reducing time spent on creating and maintaining components.",
          "• Consistent User Experience: Users benefited from a more consistent and cohesive experience across all platforms.",
          "• Scalability: The design system provided a scalable framework, supporting Live Auctioneers' continued growth and acquisition of new properties.",
          "• Enhanced Collaboration: The comprehensive documentation and single source of truth facilitated better collaboration between design and engineering teams."
        ]
      },
      {
        "label": "Lessons and Reflections",
        "paragraphs": [
          "Importance of Early Investment:",
          "One key lesson from this project was the importance of investing in a design system early in the product development lifecycle. While building a design system later in the process can still be valuable, doing so from the outset can prevent technical debt and save significant time and resources.",
          "Continuous Improvement:",
          "A design system is never truly complete; it requires continuous improvement and updates. Regular audits and feedback loops are essential to ensure the system remains relevant and effective as the product evolves.",
          "Communication and Collaboration:",
          "Effective communication and collaboration between design and engineering teams are crucial for successful implementation. Regular check-ins, reviews, and shared documentation help bridge the gap between design intent and technical execution."
        ]
      },
      {
        "label": "Conclusion",
        "paragraphs": [
          "The Auction project for Live Auctioneers was a significant undertaking that showcased the value of a well-designed and documented design system. By creating a cohesive and scalable framework, we were able to enhance the user experience, improve efficiency, and support the company's continued growth. The lessons learned from this project will inform future design system initiatives, emphasizing the importance of early investment, continuous improvement, and strong collaboration. As the Design Lead, I am proud of the work our team accomplished and the positive impact it has had on Live Auctioneers' products and users."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "proctor-and-gamble",
    "path": "/case-studies/proctor-and-gamble/",
    "collectionPath": "/",
    "title": "P&G",
    "headline": "Showcasing P&G's sustainability program",
    "metadata": {
      "client": "P&G",
      "studio": "AKQA",
      "year": "2022",
      "role": "UX Design Lead"
    },
    "meta": [
      "P&G",
      "AKQA",
      "2022",
      "UX Design Lead"
    ],
    "summary": "Here's how P&G answered the call from the next generation of beauty consumers who are increasingly conscious about the impact of their choices on the environment and society.",
    "media": {
      "label": "Procter & Gamble digital experience project image",
      "src": "/images/projects/proctor-screen.png"
    },
    "sections": [
      {
        "label": "Introduction",
        "paragraphs": [
          "Proctor & Gamble (P&G), a global leader in consumer goods, aimed to redefine its brand experience to resonate with next-generation beauty consumers. These consumers prioritize sustainability, innovation, and responsible business practices. To meet these evolving demands, P&G partnered with AKQA to create an immersive digital experience that highlights their commitment to sustainability and responsible ingredient sourcing. This case study details the design journey, from research and ideation to final implementation and results."
        ]
      },
      {
        "label": "Role and Responsibilities",
        "paragraphs": [
          "As the UX Lead, I was responsible for overseeing the user experience design of the project. My primary focus was on managing the 'Royal Gardens Kew' educational experience. I conducted thorough UX research, developed flow diagrams and wireframes, and collaborated with a senior user experience designer to ensure all elements of the project met our high standards. Additionally, I coordinated with 3D artists, visual designers, and sound designers to bring the experience to life."
        ]
      },
      {
        "label": "Research",
        "paragraphs": [
          "Understanding the Audience:",
          "We began by conducting extensive research to understand the target audience—next-generation beauty consumers who value sustainability and responsible business practices.",
          "This research included:",
          "• Surveys and Interviews: Engaging with potential users to gather insights on their values, preferences, and expectations.",
          "• Market Analysis: Examining trends in the beauty industry and identifying key factors that influence consumer choices.",
          "• Competitive Analysis: Studying similar digital experiences to identify strengths and weaknesses in the market."
        ]
      },
      {
        "label": "Insights and Key Findings",
        "paragraphs": [
          "Our research revealed several key insights:",
          "• Sustainability is Paramount: Consumers are increasingly choosing brands that prioritize environmental responsibility.",
          "• Desire for Transparency: Users want clear and honest information about the ingredients in their products and the company’s sustainability efforts.",
          "• Immersive Experiences Engage: Interactive and immersive digital experiences capture user interest and drive engagement."
        ]
      },
      {
        "label": "Ideation and Design Process",
        "paragraphs": [
          "Concept Development:",
          "With these insights in mind, we conceptualized 'The Beauty Sphere,' a captivating 3D experience that would engage users and convey P&G's sustainability principles. The narrative begins with a welcoming message set against a backdrop of clouds, guiding users through a unique building intertwined with lush greenery. This environment showcases videos highlighting P&G's sustainability initiatives, some of which are live, allowing real-time community interaction."
        ]
      },
      {
        "label": "Experience Design",
        "paragraphs": [
          "The Royal Garden Kew:",
          "My primary responsibility was designing 'The Royal Garden Kew' experience, a 3D environment resembling a tropical greenhouse. Users are invited to explore this space, collecting plant samples commonly used in P&G's products. The experience is gamified, encouraging users to navigate a maze, collect samples, and ultimately enter a central glass house. Upon completion, users receive a unique shareable artifact, commemorating their journey and P&G's pledge to plant a tree in their honor.",
          "Flow Diagrams and Wireframes:",
          "We outlined our intentions through detailed flow diagrams and wireframes, ensuring a seamless user journey. These tools were crucial for planning the navigation and interaction patterns within the 3D environment. We also managed ancillary workflows, such as sound design and ensuring accessibility standards were met.",
          "Cards System:",
          "The cards system was a crucial component of the experience, displaying videos and still frames along the building’s facade. Users could click and expand these cards for a more focused, full-screen view. Some cards featured live streams, enhancing real-time engagement with the community. The design and interaction patterns of the cards were meticulously crafted to ensure a seamless and immersive experience.",
          "Garden Maze:",
          "To navigate 'The Royal Garden Kew,' users followed a linear track through a maze, collecting plant samples along the way. Audio clips provided information about P&G's sustainability programs, creating an educational journey. Detours offered micro-adventures, highlighting endangered plants that P&G actively works to protect. The experience was designed to be simple and intuitive, enabling users to easily collect samples and earn their shareable artifact.",
          "Spacial Navigation:",
          "One of the key design challenges was figuring out how users would select a direction at each crossroad in the maze. We explored various solutions, ultimately settling on an intuitive design that allowed users to quickly and easily choose their path. The collectible plant samples were designed to be visually appealing and easy to understand, motivating users to complete the mission."
        ]
      },
      {
        "label": "Testing and Validation",
        "paragraphs": [
          "Usability Testing: We conducted usability testing with a diverse group of participants to validate our design decisions.",
          "This included:",
          "• User Testing: Observing participants as they navigated the experience to identify any usability issues.",
          "• Feedback Sessions: Gathering feedback from users to understand their perceptions and preferences.",
          "• Iterative Improvements: Making necessary adjustments based on user feedback to enhance the overall experience.",
          "Cross-Platform Consistency:",
          "Ensuring consistency across web and mobile platforms was essential. We tested the design in various environments to confirm that components behaved as expected, providing a seamless user experience regardless of the device used."
        ]
      },
      {
        "label": "Final Design and Implementation",
        "paragraphs": [
          "Building the System:",
          "The final design system featured a comprehensive component library, each element documented and built out in Figma. This robust system provided a foundation for future design and development work, streamlining processes and reducing the potential for inconsistencies.",
          "Implementation:",
          "The implementation phase involved close collaboration with the engineering team to integrate the design system into the existing product infrastructure. Regular check-ins and reviews ensured that the components were implemented correctly and functioned as intended."
        ]
      },
      {
        "label": "Outcomes and Results",
        "paragraphs": [
          "The immersive digital experience we created for P&G yielded several positive outcomes:",
          "• Increased Engagement: Users spent more time interacting with the experience, exploring P&G’s sustainability initiatives in a captivating way.",
          "• Positive Feedback: The experience received positive feedback from users, praising its visual appeal, educational value, and ease of navigation.",
          "• Brand Loyalty: By highlighting P&G’s commitment to sustainability, we helped build stronger brand loyalty among next-generation beauty consumers.",
          "• Scalability: The modular design system allowed for easy updates and expansions, ensuring the experience could evolve with P&G’s needs."
        ]
      },
      {
        "label": "Lessons and Reflections",
        "paragraphs": [
          "Importance of User-Centered Design:",
          "One key lesson from this project was the importance of keeping the user at the center of the design process. Understanding their values, preferences, and behaviors was crucial for creating an experience that resonated with them.",
          "Balancing Innovation and Usability:",
          "While innovation is important, it should not come at the expense of usability. Striking the right balance between cutting-edge design and user-friendly navigation was essential for the success of this project.",
          "Continuous Improvement:",
          "A digital experience is never truly complete. Regular updates and improvements are necessary to keep it relevant and engaging. Establishing a framework for continuous improvement was a key takeaway from this project."
        ]
      },
      {
        "label": "Conclusion",
        "paragraphs": [
          "The Beauty project for P&G was a significant undertaking that showcased the value of immersive, user-centered design. By creating a captivating digital experience that highlighted P&G’s commitment to sustainability, we were able to engage next-generation beauty consumers and build stronger brand loyalty. The lessons learned from this project will inform future design initiatives, emphasizing the importance of user-centered design, innovation, and continuous improvement. As the UX Lead, I am proud of the work our team accomplished and the positive impact it has had on P&G’s brand and users."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "thompson-reuters",
    "path": "/case-studies/thompson-reuters/",
    "collectionPath": "/",
    "title": "Thompson Reuters",
    "headline": "TV Streaming Platform for Reuters",
    "metadata": {
      "client": "Thomson Reuters",
      "studio": "Ueno",
      "year": "2015",
      "role": "UI/UX Design"
    },
    "meta": [
      "Thomson Reuters",
      "Ueno",
      "2015",
      "UI/UX Design"
    ],
    "summary": "Reuters wanted to rethink how people consume video news. The premise was simple and radical: most news apps dump a feed on you and let you drown. Reuters TV asked a different question — how much time do you actually have?",
    "media": {
      "label": "Reuters TV project scene image",
      "src": "/images/projects/reuters-screen.png"
    },
    "sections": [
      {
        "label": "Context",
        "paragraphs": [
          "Reuters wanted to rethink how people consume video news. The premise was simple and radical: most news apps dump a feed on you and let you drown. Reuters TV asked a different question — how much time do you actually have? The app would let users specify a duration — anywhere from 5 to 30 minutes — and dynamically generate a personalized newscast to fit that window, assembled from segments produced by hundreds of Reuters journalists worldwide. It was pitched as \"Netflix for News\" and launched across iOS, Android, Apple TV, Roku, and web."
        ]
      },
      {
        "label": "What I Did",
        "paragraphs": [
          "Working with Ueno's design team, I contributed to the UI/UX design across web and mobile platforms. The core design challenge was making the time-selection mechanic feel intuitive and immediate — not like configuring a settings panel, but like telling the app \"I have 10 minutes, go.\" Beyond that, the interface had to handle a dynamically generated playlist of news segments that users could skip, reorder, or download for offline viewing, all while maintaining the visual simplicity that Ueno was known for. The design stripped away the clutter that defined most news apps at the time — no endless scroll, no algorithmic feed, just a clean newscast built to your schedule."
        ]
      },
      {
        "label": "The Work",
        "paragraphs": [
          "The signature interaction was the time selector. Users set their available time and Reuters TV assembled a newscast on the fly — a curated sequence of segments tailored to their interests, location, and the day's biggest stories. The playlist appeared only when needed and stayed out of the way during playback. The design also supported \"Reuters Now,\" a constantly updated skippable news lineup, alongside uninterrupted live feeds of global events. Across platforms — phone, tablet, TV, web — the experience had to feel consistent but native to each device. On Apple TV and Roku, the interaction model shifted entirely from touch to remote navigation, which meant rethinking hierarchy and information density for a lean-back viewing context."
        ]
      },
      {
        "label": "What Happened",
        "paragraphs": [
          "Reuters TV launched in February 2015 and was widely covered as one of the more innovative approaches to news consumption at the time. It earned recognition for its design and UX, and demonstrated that there was real appetite for time-constrained, personalized news. The app ran for nearly five years before Reuters consolidated its video content back into the main Reuters News app and reuters.com in January 2020."
        ]
      },
      {
        "label": "Reflections",
        "paragraphs": [
          "The core idea — tell me how much time you have, and I'll build you something worth watching — still feels ahead of its time. Most news apps in 2026 still haven't figured this out. The product didn't survive the corporate consolidation, but the design problem was genuinely interesting: how do you make a generated experience feel curated, not algorithmic? That tension between automation and editorial craft was the whole project."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "price-waterhouse-coopers",
    "path": "/case-studies/price-waterhouse-coopers/",
    "collectionPath": "/",
    "title": "PwC",
    "headline": "Streamlining PwC's financial auditing process",
    "metadata": {
      "client": "PwC",
      "studio": "Philosophie",
      "year": "2019",
      "role": "Design Director"
    },
    "meta": [
      "PwC",
      "Philosophie",
      "2019",
      "Design Director"
    ],
    "summary": "This case study details how PwC, a leading global financial consultancy, streamlined their internal audit processes through a bespoke application developed in collaboration with Philosophie. The goal was to enhance efficiency and accuracy in financial audits for their largest enterprise clients.",
    "media": {
      "label": "Price Waterhouse Coopers website project image",
      "src": "/images/projects/pwc-website.png"
    },
    "sections": [
      {
        "label": "Introduction",
        "paragraphs": [
          "PwC, or Price Waterhouse Coopers, is a renowned global network providing services in auditing, consulting, and taxation. Recognizing inefficiencies in their traditional audit processes, PwC sought to modernize their approach by implementing a new internal tool. This tool was designed to streamline the financial audit process, reducing human error and speeding up the audit approval cycle. Philosophie, a contemporary design consultancy, was tasked with creating an intuitive and efficient application to achieve these goals. This case study explores the design journey, from initial research to final implementation, and the impact of this new tool on PwC’s audit practices."
        ]
      },
      {
        "label": "My Role and Responsibilities",
        "paragraphs": [
          "As the UI/UX Designer for this project, my role encompassed a wide range of responsibilities:",
          "• Stakeholder Interviews: Engaged with PwC’s internal teams and stakeholders to understand the existing audit process and identify pain points.",
          "• User Research: Conducted extensive research, including field visits and interviews with PwC staff, to gather insights into the auditing workflow.",
          "• Design and Prototyping: Developed wireframes and high-fidelity prototypes to visualize and refine the application’s user interface and interactions.",
          "• Collaboration: Worked closely with the product owner and the engineering team to ensure the design was feasible and aligned with PwC’s requirements.",
          "• Testing and Validation: Participated in usability testing to validate design decisions and iterated based on feedback."
        ]
      },
      {
        "label": "Research",
        "paragraphs": [
          "Understanding the Existing Process: To design an effective solution, we first needed a comprehensive understanding of PwC’s existing audit procedures. This included:",
          "• Stakeholder Interviews: We conducted interviews with key stakeholders, including audit team members and managers, to understand the current process and gather feedback on inefficiencies.",
          "• Field Visits: A visit to PwC’s office in Tampa, FL provided valuable insights into the day-to-day operations of the audit team. We interviewed Resource Specialists, Primary Specialists, Checkers, Coaches, and Managers to gain a holistic view of the auditing workflow."
        ]
      },
      {
        "label": "Key Findings",
        "paragraphs": [
          "Our research revealed several critical issues:",
          "• Inefficiencies: The previous audit process was highly manual and prone to human error. Specialists frequently copied data from multiple documents into spreadsheets, increasing the risk of mistakes.",
          "• Complexity: The process involved multiple stages, from receiving an audit request to final approval, each of which was susceptible to delays and miscommunication.",
          "• Data Management: The secure transfer and management of sensitive financial documents were cumbersome and inefficient."
        ]
      },
      {
        "label": "Ideation and Design Process",
        "paragraphs": [
          "Discover and Define: In the initial phase, our focus was on defining the problem and setting the foundation for our design approach:",
          "• Journey Mapping: We created a journey map to visualize the auditing process from start to finish. This helped identify critical touchpoints and areas for improvement.",
          "• Flow Diagrams: Detailed flow diagrams were developed to illustrate the existing process and highlight inefficiencies."
        ]
      },
      {
        "label": "Ideate and Design",
        "paragraphs": [
          "In the ideation phase, we explored various design solutions:",
          "• Wireframes: We developed wireframes to outline the user interface and interactions. These wireframes illustrated key features such as the audit setup, data entry, and document management.",
          "• Prototyping: Rapid prototypes were created to test different design concepts and gather feedback from stakeholders."
        ]
      },
      {
        "label": "Develop and Implement",
        "paragraphs": [
          "In the final phase, we focused on bringing our design to life:",
          "• High-Fidelity Design: A mood board was created to establish the visual direction. We adhered to PwC’s brand guidelines while designing a clean, intuitive interface.",
          "• Collaborative Development: Worked closely with PwC’s engineering team to ensure the design was implemented correctly and integrated seamlessly with existing systems.",
          "• Piloting: The application was piloted with actual users to test its functionality and gather feedback for further refinement."
        ]
      },
      {
        "label": "Testing and Validation",
        "paragraphs": [
          "Usability Testing:",
          "We conducted several rounds of usability testing to ensure the application met user needs and expectations:",
          "• User Feedback: Collected feedback from PwC staff to identify any usability issues or areas for improvement.",
          "• Iterative Design: Based on feedback, we iterated on the design, making necessary adjustments to enhance the user experience.",
          "Cross-Platform Consistency:",
          "Ensured that the application was consistent across different devices and platforms. Testing was conducted to confirm that the application functioned correctly and provided a seamless experience for all users."
        ]
      },
      {
        "label": "Final Design and Implementation",
        "paragraphs": [
          "Design Features:",
          "• Audit Portal: The application features a centralized portal where managers and specialists can access and manage audit assignments. This portal allows for efficient allocation of tasks and monitoring of team progress.",
          "• Audit Workflow: Users can create and set up audits by uploading documents and templates, or by starting from scratch. The workflow includes steps for data entry, formula application, and review.",
          "• Document Reader: A critical feature, the document reader securely parses and populates data from client documents into the audit spreadsheet, reducing manual data entry and minimizing errors.",
          "• Test Summary: Managers and coaches can review progress across ongoing audits, leave notes, and participate in the audit process, enhancing communication and oversight.",
          "Implementation:",
          "The final design was implemented with careful attention to detail, ensuring that all features were functional and met user needs. Collaboration with the engineering team was crucial to integrate the design with PwC’s existing systems."
        ]
      },
      {
        "label": "Outcomes and Results",
        "paragraphs": [
          "Improved Efficiency:",
          "The new application significantly improved the efficiency of the auditing process. Automation of data entry and document management reduced the time required to complete audits and minimized human error.",
          "Enhanced Accuracy:",
          "By streamlining the audit setup and providing features like the document reader, the application increased the accuracy of financial audits. This resulted in more reliable audit outcomes and reduced the need for manual corrections.",
          "Better Communication:",
          "The application’s test summary feature facilitated better communication among team members, allowing for more effective collaboration and oversight.",
          "User Satisfaction:",
          "The application received positive feedback from PwC staff, who appreciated its intuitive design and enhanced functionality. The tool successfully addressed many of the pain points identified during the research phase."
        ]
      },
      {
        "label": "Lessons Learned and Reflections",
        "paragraphs": [
          "Understanding User Needs:",
          "One key lesson was the importance of thoroughly understanding user needs and pain points. The insights gained from interviews and field visits were crucial in designing a solution that truly addressed the challenges faced by the audit team.",
          "Balancing Complexity and Usability:",
          "Designing for a complex workflow required careful balancing of functionality and usability. Ensuring that the application was both powerful and easy to use was essential for its success.",
          "Iterative Design:",
          "The iterative design process proved invaluable in refining the application. Regular feedback and testing allowed us to make informed adjustments and improvements, resulting in a final product that met user needs effectively.",
          "Collaboration:",
          "Close collaboration with PwC’s engineering team and stakeholders was crucial throughout the project. This ensured that the design was feasible, aligned with requirements, and seamlessly integrated into existing systems."
        ]
      },
      {
        "label": "Conclusion",
        "paragraphs": [
          "The Audit project for PwC was a successful endeavor that demonstrated the impact of thoughtful UX design on improving complex workflows. By addressing inefficiencies and enhancing the auditing process, the new application has significantly benefited PwC’s internal operations. The lessons learned from this project will inform future design initiatives, emphasizing the importance of user-centered design, iterative refinement, and effective collaboration. As a UI/UX Designer, I am proud of the work accomplished and the positive impact it has had on PwC’s audit practices."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "avantos",
    "path": "/case-studies/avantos/",
    "collectionPath": "/",
    "title": "Avantos",
    "headline": "AI-Powered Client Onboarding for Investment Banking",
    "metadata": {
      "client": "Avantos",
      "studio": "Independent",
      "year": "2024–2025",
      "role": "AI Product Designer"
    },
    "meta": [
      "Avantos",
      "Independent",
      "2024–2025",
      "AI Product Designer"
    ],
    "summary": "A comprehensive product design engagement with Avantos that reimagined how investment banking institutions onboard prospective clients — delivering a two-sided, AI-powered software platform that streamlined a traditionally manual, high-friction process.",
    "media": {
      "label": "Avantos product interface project image",
      "src": "/images/projects/avantos-screen.png"
    },
    "sections": [
      {
        "label": "Introduction",
        "paragraphs": [
          "Client onboarding at investment banking institutions is one of the most complex, high-touch workflows in financial services. It involves collecting sensitive financial documents, verifying data across multiple sources, coordinating between advisors, relationship service associates (RSAs), and regional vice presidents (RVPs), and ensuring regulatory compliance at every step. Historically, this process has been overwhelmingly manual — reliant on paper forms, email chains, and fragmented tooling — creating friction for both the prospective clients and the financial operators managing their accounts.",
          "Avantos approached our team to design and prototype a two-sided software platform that would modernize this entire onboarding journey. The platform needed to serve two distinct user groups: the prospective clients navigating the onboarding process, and the financial operators managing, verifying, and advancing those relationships. The primary challenge was to introduce AI-powered automation into a domain where trust, accuracy, and regulatory compliance are paramount — while ensuring the experience remained intuitive, transparent, and human-centered. Objectives included:",
          "• Designing a white-label customer-facing application that investment banks could easily adopt.",
          "• Building an operator-facing management platform for overseeing onboarding workflows.",
          "• Integrating AI features that meaningfully reduced manual effort — including document ingestion, data pre-population, and an agent chatbot.",
          "• Defining a flexible data model capable of handling the hierarchical complexity of onboarding journeys.",
          "• Validating the product through stakeholder interviews and pilot testing with financial professionals."
        ]
      },
      {
        "label": "My Role and Responsibilities",
        "paragraphs": [
          "The project team was lean, operating independently with direct collaboration with Avantos leadership, engineering, and subject matter experts from the investment banking domain.",
          "Responsibilities:",
          "• Leading end-to-end product design across both the customer and operator experiences.",
          "• Conducting user research, including persona development, journey mapping, and stakeholder interviews.",
          "• Designing the complete UX architecture — from information architecture and data modeling to interaction design and high-fidelity UI.",
          "• Conceptualizing and designing AI-powered features including document scraping, data pre-population, agent chatbot, and real-time collaborative support.",
          "• Creating wireframes, prototypes, and production-ready design specifications.",
          "• Collaborating closely with engineering to define the data model and ensure design feasibility.",
          "• Contributing to investor-facing materials that supported Avantos's Series A fundraise."
        ]
      },
      {
        "label": "Research",
        "paragraphs": [
          "User Research:",
          "Our research phase was designed to build deep empathy for both sides of the onboarding equation — the prospective clients who find the process opaque and burdensome, and the financial operators who manage hundreds of these relationships simultaneously.",
          "Journey Mapping:",
          "To best understand the working process of our financial operators as they onboard prospect clients, we built a comprehensive journey map ensuring that we completely understood the analog onboarding process. This same journey map served as a complex prompt during our series of stakeholder interviews, grounding conversations in specific workflow stages rather than abstract pain points.",
          "The journey map spanned from verbal commitment through to the first 90 days post-handoff, covering phases including initiation, data collection and documentation, account setup and compliance, and review and handoff.",
          "Stakeholder Interviews:",
          "We drafted a series of targeted interview questions and conducted 15 interviews in total, focusing on RSA, RVP, and advisor professionals. Questions explored how teams communicate during onboarding, what tools they use to track progress, where bottlenecks occur, and what would make their work meaningfully easier.",
          "Key insights from our research included:",
          "• Manual data entry was the single largest source of operator frustration — repetitive, error-prone, and time-consuming.",
          "• Prospective clients frequently felt lost in the process, unsure of what was expected of them, how long it would take, or who to contact for help.",
          "• Coordination between operators (RVPs handing off to RSAs, RSAs coordinating with advisors) was fragmented across email, phone, and disconnected systems.",
          "• Trust and transparency were essential — clients dealing with sensitive financial data needed to feel confident that their information was secure and handled correctly.",
          "Based on our research, we developed detailed personas:",
          "• Emily Carter (The Family Wealth Steward): A 50-year-old married mother of three in Boston's suburbs with a $12 million net worth, primarily in real estate and trust funds. Emily is not particularly tech-savvy and finds most digital tools intimidating without proper guidance. She prefers guided, high-touch experiences with pre-filled forms, checklists, and progress indicators. She values platforms that translate complex financial data into practical advice and is skeptical about whether digital tools can handle her family's intricate financial structure without her advisors' input.",
          "• Laura Thompson (The Financial Operator): A relationship service associate managing dozens of concurrent onboarding relationships. Laura needs a centralized view of all active onboardings, the ability to quickly assess progress and flag issues, and tools that reduce the manual data entry and verification that consumes most of her working hours."
        ]
      },
      {
        "label": "Ideation and Design Process",
        "paragraphs": [
          "Data Model Definition:",
          "Before diving into interface design, we needed to define the underlying data architecture that would support the complex, multi-layered onboarding process. Our team worked to define a system capable of handling the hierarchical structure of a customer journey:",
          "• 01 — Journey: Highest order grouping. Example: Onboarding.",
          "• 02 — Phase: Organization. Examples: Setup the client; Handover.",
          "• 03 — Action: Group of tasks and sub-actions. Examples: Client data collection; Create accounts.",
          "• 04 — Sub-Action Group: Organization. Example: Your financial plan.",
          "• 05 — Sub-action: Group of tasks. Examples: Document upload; Your goals and services.",
          "• 06 — Task: Atomic unit, such as a form. Examples: Your goals; Your services.",
          "This data model directly informed the application's navigation logic and provided a flexible, configurable framework that could adapt to different banking institutions' onboarding processes.",
          "Customer Experience Design:",
          "We designed a customer-facing white-label application that could be easily adopted by investment banking teams. The customer experience centered on several core principles:",
          "• Pre-population over manual entry: After initial document upload, the AI would scrape financial documents for key data points, pre-populating the onboarding form and allowing the user to play a checker role rather than a data entry role.",
          "• Persistent AI assistance: An always-available AI agent chatbot provided answers to virtually any question about the onboarding process — from \"How long does onboarding take?\" to \"Is my personal and financial information secure?\"",
          "• Progressive disclosure: The interface guided users through the process step by step, with clear progress indicators and contextual explanations for why specific information was needed.",
          "• Real-time collaborative support: Both the AI agent and human financial operators could access the customer portal and provide live support, with the ability for clients to directly @mention their advisor in the chat.",
          "Operator Experience Design:",
          "The operator experience provided members of the investment banking team with the ability to manage all of their relationships, including new prospect onboarding. Key design decisions included:",
          "• Dense dashboard views enabling operators to see all active onboarding relationships at a glance, with status indicators, progress bars, and content completeness metrics.",
          "• Drill-down relationship management allowing operators to inspect individual onboarding sessions, review AI-extracted data, check document completeness, and trigger additional client work requests.",
          "• Configurable journey templates so operators could set up new onboarding relationships with appropriate phases, actions, and tasks — adapting the standard template to each client's specific situation.",
          "• Document verification tooling with AI confidence scoring, cross-referencing extracted data points back to source documents, and flagging items that needed manual review."
        ]
      },
      {
        "label": "Key Designs",
        "paragraphs": [
          "AI Document Ingestion:",
          "When a prospective client uploads their financial documents — tax returns, investment account statements, mortgage statements, Social Security benefits — the AI rapidly extracts key data points and cross-references them against source materials. The operator sees a confidence-scored table showing each extracted value, its source document and line reference, and its consistency status. This transformed the operator's role from manual data entry to focused verification.",
          "Agent Chatbot:",
          "One of the most impactful features was an AI chat agent trained on the specifics of the onboarding process. For the prospective client, it answered questions, provided guidance, and reduced the need to contact a human advisor for routine inquiries. For the operator, it could surface contextual information and assist with data interpretation. The chatbot existed as a collapsible panel alongside the main application, always available but never intrusive.",
          "Real-Time Collaborative Support:",
          "When questions arose that exceeded the AI agent's capabilities, both the chatbot and human financial operators could seamlessly enter the conversation. The chat interface supported @mentioning specific team members, and operators could view and interact with the client's portal in real time — providing live co-browsing assistance without requiring a third-party tool.",
          "Onboarding Creation Flow:",
          "For operators, we designed a streamlined two-step flow for initiating new onboarding relationships: first capturing basic information (relationship, start date, assignment), then configuring the journey contents — selecting which phases, actions, and tasks to include or skip, and publishing the configured onboarding to the client.",
          "DocuSign API Integration:",
          "Once the onboarding data collection was complete, the operator could trigger the secure transfer of documents from the prospect's original account custodian and send a DocuSign to the client to confirm the contractual relationship — all from within the platform."
        ]
      },
      {
        "label": "Testing and Validation",
        "paragraphs": [
          "Pilot Testing:",
          "We pilot tested the application with over 100 investment bankers, gathering direct feedback on workflows, terminology, and feature utility. This testing was critical for validating that our understanding of the onboarding process — built through journey mapping and interviews — translated into a tool that actually fit into operators' daily workflows.",
          "Feedback and Insights:",
          "• Positive Feedback: Operators responded strongly to the AI document ingestion and data pre-population features, which addressed their most acute pain point. The hierarchical data model was validated as flexible enough to accommodate the variety of onboarding scenarios they encountered.",
          "• Areas for Improvement: Some operators wanted deeper AI features — more proactive suggestions, predictive guidance based on client behavior, and automated escalation for flagged issues. These aligned with the conceptual future-state features our team had envisioned but were beyond the MVP scope.",
          "• Iterations Based on Feedback: We refined the document verification interface to better surface confidence levels and cross-references, adjusted the operator dashboard to support additional filtering and sorting options, and improved the customer-facing progress indicators based on client confusion points identified during testing."
        ]
      },
      {
        "label": "Final Design and Implementation",
        "paragraphs": [
          "Final Design:",
          "The final deliverable was a comprehensive MVP prototype spanning both sides of the platform:",
          "Customer Experience:",
          "A white-label web application featuring AI-powered document upload and data extraction, a step-by-step guided onboarding flow with pre-populated forms, persistent AI chatbot assistance, real-time collaborative support with human operators, and clear progress tracking throughout the journey.",
          "Operator Experience:",
          "A management platform featuring a dense onboarding dashboard with status filtering and relationship drill-downs, configurable journey templates built on the hierarchical data model, document verification tooling with AI confidence scoring, task assignment and progress monitoring, and DocuSign integration for contract execution.",
          "AI Features (Conceptual Future State):",
          "Beyond the baseline AI features included in the MVP, our team executed a variety of conceptual directions expressing the intention for future AI capabilities — including predictive personalization, automated escalation, proactive guidance, and interactive meeting summaries.",
          "Implementation:",
          "We collaborated closely with Avantos's engineering team throughout, ensuring the data model, interaction patterns, and AI integration points were technically feasible and aligned with the platform architecture. The design artifacts served dual purposes — guiding engineering implementation while also supporting Avantos's investor communications during their fundraising process."
        ]
      },
      {
        "label": "Outcomes and Results",
        "paragraphs": [
          "Metrics and KPIs:",
          "Funding:",
          "We helped Avantos secure over $2 million in Series A round funding. The prototype and design vision were central to demonstrating the product's market potential to investors.",
          "Pilot Validation:",
          "The application was pilot tested with and received feedback from over 100 investment bankers, validating the product-market fit and surfacing actionable refinements for subsequent iterations.",
          "Stakeholder Alignment:",
          "The 15 stakeholder interviews and comprehensive journey mapping created a shared understanding of the onboarding process across the organization — a foundational asset for ongoing product development.",
          "Business Impact:",
          "The successful delivery of the MVP prototype positioned Avantos to move from concept to funded startup, with a validated product vision, a tested prototype, and a clear roadmap for AI feature expansion. The white-label architecture ensured the platform could scale across multiple banking institutions without significant redesign."
        ]
      },
      {
        "label": "Lessons Learned and Reflections",
        "paragraphs": [
          "Challenges we faced:",
          "• MVP vs. Future State Tension: The team worked on imagining future AI-powered features but only executed the baseline MVP prototype. There were many additional conceptual directions that we were unable to investigate within the engagement scope — and the gap between what AI could do and what the MVP delivered was a constant creative tension.",
          "• Designing for Trust in Sensitive Domains: Introducing AI automation into financial services required exceptional care around transparency, accuracy indicators, and human oversight. Every AI-generated data point needed a clear provenance trail back to source documents, and every automated action needed a human checkpoint.",
          "• Two-Sided Design Complexity: Designing for two fundamentally different user groups — clients who interact with the platform once during their onboarding, and operators who live in it daily — required maintaining two distinct design vocabularies while ensuring the underlying system remained coherent.",
          "What I learned:",
          "• Moving Fast Isn't Enough: Moving fast isn't enough if you are moving fast to build legacy software. I suspect we are approaching a moment in time where SaaS software will fall into jeopardy and become overshadowed by advanced AI alternatives. Companies have to start building the future thing out of the gate — unless they truly believe they have the luxury to stage things out as was once common practice.",
          "• Journey Mapping as Interview Tool: Using the journey map as a conversational prompt during stakeholder interviews was one of our most effective research techniques. It grounded abstract discussions in concrete workflow stages and helped operators articulate pain points they might not have surfaced unprompted.",
          "• Data Modeling as Design: The hierarchical data model (Journey \\> Phase \\> Action \\> Sub-Action Group \\> Sub-action \\> Task) was as much a design decision as any interface element. Getting this structure right was essential for both the operator's ability to configure onboarding workflows and the customer's experience of progressing through them.",
          "Collaboration:",
          "Working independently with direct access to Avantos leadership enabled fast decision-making, but the lean team structure also meant wearing multiple hats — from user researcher to interaction designer to visual designer to strategic advisor. The breadth of the role was demanding but ultimately rewarding, as it ensured design consistency and coherent vision across the entire platform.",
          "Future improvements:",
          "• Deeper AI Integration: Expanding beyond document ingestion and chatbot support into predictive guidance, automated personalization, and proactive escalation — the conceptual directions our team envisioned but couldn't execute within the MVP scope.",
          "• Expanded Operator Tooling: Building out the real-time collaboration features, including co-browsing, calendar integration, and automated meeting summaries.",
          "• Multi-Institution Customization: Developing the white-label theming and configuration capabilities to support deployment across diverse banking institutions with varying onboarding requirements."
        ]
      },
      {
        "label": "Conclusion",
        "paragraphs": [
          "The Avantos engagement was a deeply rewarding project that sat at the intersection of AI product design, complex workflow automation, and financial services domain expertise. Designing a two-sided platform that needed to serve both anxious prospective clients and overburdened financial operators required constant empathy-switching and rigorous systems thinking.",
          "The project's success — measured in secured funding, validated pilot testing, and a clear product roadmap — demonstrated that thoughtful, human-centered design can unlock the potential of AI in even the most sensitive and complex professional domains. Rather than replacing human judgment, the AI features we designed amplified it — reducing manual drudgery so that operators could focus on the relationship-building and nuanced decision-making that only humans can provide, while giving clients a transparent, guided experience that replaced confusion with confidence.",
          "Reflecting on this project, it reinforced a conviction that has become central to my design practice: the most impactful AI products are not the ones that automate the most, but the ones that most thoughtfully balance automation with human agency, transparency, and trust."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "turner-tv",
    "path": "/case-studies/turner-tv/",
    "collectionPath": "/",
    "title": "Turner Media",
    "headline": "Designing the Future of Streaming",
    "metadata": {
      "client": "TURNER",
      "studio": "Philosophie",
      "year": "2019",
      "role": "UX Design, Workshop Facilitation"
    },
    "meta": [
      "TURNER",
      "Philosophie",
      "2019",
      "UX Design, Workshop Facilitation"
    ],
    "summary": "By 2019, Turner Broadcasting was deep into its streaming pivot. Netflix had rewritten the rules, and legacy media companies were scrambling to figure out direct-to-consumer.",
    "media": {
      "label": "Turner TV streaming interface project image",
      "src": "/images/projects/turner-media-screen.png"
    },
    "sections": [
      {
        "label": "Context",
        "paragraphs": [
          "By 2019, Turner Broadcasting was deep into its streaming pivot. Netflix had rewritten the rules, and legacy media companies were scrambling to figure out direct-to-consumer. Turner had already acquired iStreamPlanet, launched FilmStruck, and brought in outside consultants to map innovation strategy — but they still needed to answer a fundamental question: what do everyday viewers actually want from a Turner streaming product? Not what executives assumed. Not what competitors were doing. What real people, across demographics, would pay attention to."
        ]
      },
      {
        "label": "What I Did",
        "paragraphs": [
          "I designed and facilitated an ideation workshop built around a panel of everyday TV viewers — diverse in age, habits, and demographics. Using card sorting exercises and a range of participatory design methods, I guided participants through structured activities to surface feature ideas grounded in actual viewing behavior rather than industry assumptions. The goal was to bypass the boardroom and go straight to the audience. Once we had a prioritized set of concepts from the workshop, I rapidly prototyped a series of those features as interactive prototypes — taking raw ideas from sticky notes to tappable screens within days."
        ]
      },
      {
        "label": "The Work",
        "paragraphs": [
          "The workshop was designed to do two things: generate honest signal from non-industry people, and move fast enough that the ideas didn't die in a deck. Card sorting helped participants organize and prioritize content types, navigation models, and feature concepts in ways that revealed their mental models — how they actually thought about watching TV versus how streaming platforms assumed they did. The gap between those two things was the insight.",
          "From there, we pulled the strongest concepts and built interactive prototypes that Turner stakeholders could react to immediately. These weren't wireframes or static mocks — they were functional enough to put in someone's hands and watch them use. The speed mattered. Turner was operating in a window where decisions needed to be made quickly, and having something tangible to evaluate changed the conversation from theoretical strategy to concrete product direction."
        ]
      },
      {
        "label": "What Happened",
        "paragraphs": [
          "The workshop outputs and prototypes gave Turner's product team a consumer-validated foundation for feature prioritization on their streaming platform. The work fed directly into internal strategy discussions at a moment when Turner was making critical bets on its direct-to-consumer future — decisions that would eventually fold into the broader WarnerMedia reorganization and the path toward what became HBO Max."
        ]
      },
      {
        "label": "Reflections",
        "paragraphs": [
          "This was one of those projects where the method was the product. The prototypes mattered, but what really mattered was getting a room full of real people to tell a legacy media company something it didn't already believe. That's harder than it sounds when you're working with an organization that's been broadcasting to an audience for decades and suddenly has to listen to one."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "mcdonalds",
    "path": "/case-studies/mcdonalds/",
    "collectionPath": "/",
    "title": "McDonalds",
    "headline": "McDonald's In-Restaurant Kiosk Experience",
    "metadata": {
      "client": "McDonald's",
      "studio": "Method",
      "year": "2018",
      "role": "Lead UX Designer"
    },
    "meta": [
      "McDonald's",
      "Method",
      "2018",
      "Lead UX Designer"
    ],
    "summary": "McDonald's was in the middle of \"Experience of the Future\" — one of the most ambitious digital transformations in QSR history. Self-order kiosks were rolling out to thousands of locations globally, but the first version of the kiosk application had clear UX problems.",
    "media": {
      "label": "McDonald's self-order kiosk project image",
      "src": "/images/projects/mcdonalds-kiosk.png"
    },
    "sections": [
      {
        "label": "Context",
        "paragraphs": [
          "McDonald's was in the middle of \"Experience of the Future\" — one of the most ambitious digital transformations in QSR history. Self-order kiosks were rolling out to thousands of locations globally, but the first version of the kiosk application had clear UX problems. The interface needed to handle a massive menu, customization options, upsells, and payment — all for a customer base that ranged from teenagers to seniors who had never touched a screen to order food. Method had been partnering with McDonald's over a multi-year engagement to rethink the digital experience across every customer touchpoint — mobile app, web, kiosks, and digital menu boards. Our piece was the kiosk: research and audit v1, then design v2 as part of the broader digital-first in-restaurant experience."
        ]
      },
      {
        "label": "What I Did",
        "paragraphs": [
          "I led UX on the kiosk redesign. The work started with a thorough audit of the existing kiosk application — mapping pain points, observing real customers in real restaurants, and identifying where the interface was failing. Method's research process spanned multiple markets including the US, UK, Australia, and China, combining remote and in-person studies to understand how ordering behavior differed across cultures and demographics. From that research, I worked on designing the v2 kiosk experience — restructuring navigation, simplifying the menu architecture, and rethinking the ordering flow to reduce friction and improve clarity for first-time users."
        ]
      },
      {
        "label": "The Work",
        "paragraphs": [
          "The fundamental tension was between McDonald's menu complexity and the need for speed. A kiosk in a busy restaurant has maybe 60 seconds of a customer's patience. The v1 interface tried to show too much at once — deep menu trees, aggressive upsell prompts, cluttered customization screens. The v2 redesign focused on reducing cognitive load at every step. Clearer category organization, larger product imagery, and a streamlined customization flow that didn't feel like filling out a form. The kiosk didn't exist in isolation — it had to feel like part of the same experience as the mobile app and digital menu boards. Method developed a global digital design system that unified visual language and interaction patterns across all of McDonald's digital touchpoints, ensuring a customer who ordered on the app would feel immediately familiar at the kiosk. The research also surfaced operational insights — how kiosk orders integrated with kitchen display screens alongside counter and drive-through orders, and how the physical placement and flow of kiosks in the restaurant affected usage rates and comfort."
        ]
      },
      {
        "label": "What Happened",
        "paragraphs": [
          "The redesigned kiosk experience rolled out as part of McDonald's accelerated deployment — upgrading 1,000 restaurants per quarter. Kiosks reached over 15,000 locations globally. The business impact was measurable: a 5-6% increase in average check size in the first year, driven partly by smarter upsell placement and the fact that customers browsed more of the menu on screen than they did at a counter. The work fed into McDonald's broader digital design system that Method built to scale across every customer-facing digital surface worldwide."
        ]
      },
      {
        "label": "Looking Back",
        "paragraphs": [
          "There's something humbling about designing for McDonald's scale. You're not designing for a persona — you're designing for essentially everyone. The kiosk has to work for a kid ordering a Happy Meal and a construction worker on a lunch break and someone's grandmother. That range forces you to strip away every assumption about digital literacy and just make the thing obvious. It was the most operationally complex design problem I've worked on."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "northwestern-mutual",
    "path": "/case-studies/northwestern-mutual/",
    "collectionPath": "/",
    "title": "NW Mutual",
    "headline": "Designing Financial Planning",
    "metadata": {
      "client": "Northwestern Mutual",
      "studio": "Direct with client",
      "year": "2016",
      "role": "UX/UI Design"
    },
    "meta": [
      "Northwestern Mutual",
      "Direct with client",
      "2016",
      "UX/UI Design"
    ],
    "summary": "Northwestern Mutual had just acquired LearnVest for $250 million — a bet that a 158-year-old insurance company could modernize its financial planning experience by absorbing a fintech startup with 1.5 million registered users.",
    "media": {
      "label": "Northwestern Mutual predictive planning project image",
      "src": "/images/projects/nwmutual-screen.png"
    },
    "sections": [
      {
        "label": "Context",
        "paragraphs": [
          "Northwestern Mutual had just acquired LearnVest for $250 million — a bet that a 158-year-old insurance company could modernize its financial planning experience by absorbing a fintech startup with 1.5 million registered users. LearnVest's platform gave people tools to track spending, visualize budgets, set financial goals, and connect with certified financial planners — all through a clean, consumer-friendly interface that made personal finance feel approachable rather than intimidating. Post-acquisition, the New York team was scaling rapidly from 150 to nearly 450 employees, and the platform needed design work across desktop and mobile to support the integration of LearnVest's consumer-facing experience with Northwestern Mutual's broader financial planning ecosystem."
        ]
      },
      {
        "label": "What I Did",
        "paragraphs": [
          "I worked directly with the Northwestern Mutual / LearnVest team designing a variety of views across their desktop and mobile platform apps. The work spanned multiple surfaces within the product — dashboard views, budgeting interfaces, goal tracking, account management — each requiring consideration for how users moved between features and how information density scaled between desktop and mobile contexts. The design challenge was maintaining the simplicity that made LearnVest successful as a standalone product while accommodating the expanded scope and user base that came with being part of Northwestern Mutual."
        ]
      },
      {
        "label": "The Work",
        "paragraphs": [
          "Financial planning apps live or die on information design. Users are looking at their money — a subject loaded with anxiety — and the interface has to make that feel manageable, not overwhelming. The desktop platform could afford more density: side-by-side views of spending categories, trend visualizations, goal progress, and advisor communications. Mobile had to compress all of that into something someone could glance at on a train and understand instantly — am I on track or not? The design work also had to navigate the tension between LearnVest's startup DNA — minimal, friendly, consumer-first — and Northwestern Mutual's institutional weight. The platform couldn't feel like a bank pamphlet, but it also couldn't feel like a budgeting toy. It had to land somewhere that respected both the user's intelligence and their anxiety about money."
        ]
      },
      {
        "label": "What Happened",
        "paragraphs": [
          "The LearnVest platform continued to operate and evolve under Northwestern Mutual through 2018, when the consumer-facing service was eventually discontinued and its technology was absorbed into Northwestern Mutual's internal planning tools. By that point, the LearnVest team in New York had tripled in size and the platform's design language had influenced how Northwestern Mutual approached digital experiences across the company. The technology outlived the brand."
        ]
      },
      {
        "label": "Reflections",
        "paragraphs": [
          "Designing for personal finance means designing for emotion as much as function. Every screen is someone confronting their financial reality. The difference between a dashboard that motivates and one that paralyzes is often just hierarchy — what you show first, what you let people discover on their own, and what you quietly keep out of the way until they're ready."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "amazon-fire-tv",
    "path": "/case-studies/amazon-fire-tv/",
    "collectionPath": "/",
    "title": "Amazon",
    "headline": "Amazon Fire TV",
    "metadata": {
      "client": "AMAZON",
      "studio": "Sketch",
      "year": "2024 — 2025",
      "role": "Design Lead"
    },
    "meta": [
      "AMAZON",
      "Sketch",
      "2024 — 2025",
      "Design Lead"
    ],
    "summary": "A provisional case-study record for Andrew's Design Lead work with Sketch and Amazon Fire TV during 2024–2025.",
    "media": {
      "label": "Amazon Fire TV interface displayed in a vehicle",
      "src": "/images/projects/amazon-fire-tv.png"
    },
    "sections": [
      {
        "label": "Context",
        "paragraphs": [
          "The verified portfolio record currently identifies Amazon Fire TV as a Sketch engagement from 2024–2025. Additional project context has not yet been supplied."
        ]
      },
      {
        "label": "Work",
        "paragraphs": [
          "Andrew's verified role was Design Lead. The specific responsibilities, team structure, process, and deliverables will be added when the supporting case-study material is available."
        ]
      },
      {
        "label": "Outcome",
        "paragraphs": [
          "Outcome details have not yet been supplied. This temporary entry avoids attributing unverified product results or claims to the engagement."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "andrew-eccles",
    "path": "/case-studies/andrew-eccles/",
    "collectionPath": "/",
    "title": "Andrew Eccles",
    "headline": "A Portfolio Built Around the Work",
    "metadata": {
      "client": "Andrew Eccles",
      "studio": "Crate",
      "year": "2016",
      "role": "UX/UI Design"
    },
    "meta": [
      "Andrew Eccles",
      "Crate",
      "2016",
      "UX/UI Design"
    ],
    "summary": "An image-led portfolio website that gave commercial photographer Andrew Eccles a flexible framework for presenting work across entertainment, music, film, and sports.",
    "media": {
      "label": "Andrew Eccles website project image",
      "src": "/images/projects/andrew-eccles-screen.png"
    },
    "sections": [
      {
        "label": "Context",
        "paragraphs": [
          "In 2016, commercial photographer Andrew Eccles worked with Crate to create a portfolio website for work spanning entertainment, music, film, and sports. The site needed to present recognizable subjects without allowing celebrity to overwhelm the photography. It also had to support how prospective clients, agencies, and editors review portfolios: quickly, visually, and across varied image formats. The challenge was creating enough structure to make a large archive navigable while keeping the interface quiet and image-led."
        ]
      },
      {
        "label": "Work",
        "paragraphs": [
          "I worked with Crate and directly with Andrew on UX and interface design. My role focused on organizing content, defining browsing paths, and translating the character of his work into a responsive system. That meant balancing Andrew's point of view with practical portfolio needs: clear groupings, predictable navigation, and layouts that could accommodate portraits, editorial series, and commercial assignments without forcing every image into the same presentation. The design direction treated the website as a flexible viewing environment rather than a conventional marketing site. Large photography carried the experience, while typography and controls were deliberately restrained. We explored how visitors could move between bodies of work, understand the context of an assignment, and continue browsing without repeatedly returning to an index. Page templates were structured around sequencing and pacing, allowing individual images to hold attention while still feeling connected to a broader series. Responsive behavior was especially important because tight mobile crops could change the impact of a portrait. The layouts therefore prioritized image integrity, useful focal points, and simple transitions between overview and detail states."
        ]
      },
      {
        "label": "Outcome",
        "paragraphs": [
          "The resulting portfolio direction gave Andrew a coherent framework for presenting commercial and editorial photography to different audiences. It brought a varied archive into one visual system without making the work feel mechanically uniform. The site could foreground the personality of each shoot while maintaining a consistent browsing experience and provide a practical foundation for publishing new work as the portfolio evolved. The project reinforced that portfolio design is an exercise in restraint. The interface has to provide orientation, but it should never compete with the work it presents. Designing around photographs with different proportions, subjects, and emotional tones required a system that was disciplined without becoming rigid. The strongest decisions made the website recede while helping each series land with clarity."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "modern-age",
    "path": "/case-studies/modern-age/",
    "collectionPath": "/",
    "title": "Modern Age",
    "headline": "Connecting Digital Discovery to In-Person Care",
    "metadata": {
      "client": "Modern Age",
      "studio": "Direct with client",
      "year": "2021",
      "role": "Design Lead"
    },
    "meta": [
      "Modern Age",
      "Direct with client",
      "2021",
      "Design Lead"
    ],
    "summary": "A connected digital journey that helped Modern Age customers discover services, find a physical location, book appointments, and complete checkout with confidence.",
    "media": {
      "label": "Modern Age website project image",
      "src": "/images/projects/modern-age-screen.png"
    },
    "sections": [
      {
        "label": "Context",
        "paragraphs": [
          "In 2021, Modern Age was building a technology-enabled service that connected its digital experience with in-person therapeutic care. The website had to do more than explain the offering: it needed to help prospective customers understand available services, find an appropriate brick-and-mortar location, book an appointment, and complete checkout with confidence. As the startup expanded, those journeys accumulated new decisions and promotional messages, creating a need for clearer structure across discovery, scheduling, and conversion."
        ]
      },
      {
        "label": "Work",
        "paragraphs": [
          "I joined the startup directly as Design Lead and worked across the website and supporting customer journeys. My role included shaping new product features, improving location discovery, refining appointment booking and checkout, and designing ancillary experiences such as the chatbot and promotional modules. I collaborated with the internal team to translate evolving business needs into flows and interface patterns that could be implemented incrementally without making the customer experience feel fragmented. The work focused on reducing uncertainty at the moments where a customer had to move from interest to action. Location pages and find-a-location pathways were organized to make proximity, services, and next steps easier to understand. Booking and checkout flows were reviewed as connected parts of one journey, with attention to sequence, form requirements, and the information customers needed before committing to an appointment. The chatbot was designed as a supporting guide rather than a replacement for the primary navigation, helping answer common questions and direct visitors toward relevant services or locations. I also helped create a flexible promotional component system for the main website and social channels. Those modules gave the team a consistent way to rotate offers and timely messages without rebuilding the surrounding experience for each campaign."
        ]
      },
      {
        "label": "Outcome",
        "paragraphs": [
          "The resulting design work connected Modern Age's marketing site more directly to its physical service experience. Customers had clearer paths from learning about the company to locating a clinic, selecting an appointment, and completing checkout. The reusable chatbot and promotional patterns also gave the startup additional ways to support questions and communicate changing offers while maintaining a coherent visual and interaction system. Working inside an early-stage company required balancing immediate growth needs with the foundations of a durable product. Conversion improvements could not be isolated from trust, especially when a digital journey ended in an in-person therapeutic service. The project reinforced the value of treating content, location discovery, scheduling, and checkout as one continuous experience rather than a collection of independent features."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "pi-app",
    "path": "/case-studies/pi-app/",
    "collectionPath": "/",
    "title": "Positive Intelligence",
    "headline": "From Philosophy to Brand and Product",
    "metadata": {
      "client": "Positive Intelligence",
      "studio": "Direct with founder",
      "year": "2018",
      "role": "Brand & Product Design"
    },
    "meta": [
      "Positive Intelligence",
      "Direct with founder",
      "2018",
      "Brand & Product Design"
    ],
    "summary": "A brand foundation and rapid MVP that translated the Positive Intelligence philosophy into a structured, approachable digital practice.",
    "media": {
      "label": "P.I. App mobile product project image",
      "src": "/images/projects/positiveintelligence-screen.png"
    },
    "sections": [
      {
        "label": "Context",
        "paragraphs": [
          "Positive Intelligence needed an initial brand and product expression that could translate its founder's published philosophy into a practical digital experience. The program presented a framework for recognizing unproductive mental patterns and building more constructive habits, but the first application had to turn that body of teaching into something people could understand and use over time. The opportunity was twofold: establish a recognizable identity for the company, then rapidly prototype an MVP that made the practice feel approachable, structured, and credible."
        ]
      },
      {
        "label": "Work",
        "paragraphs": [
          "I worked directly with the founder across brand and product design. I created the initial logo and typography direction, then carried those foundations into the first application prototype. My role connected identity, interface, and experience design, allowing the product to develop with one coherent visual language rather than treating branding as a separate layer applied after the functionality had been defined. The identity work focused on expressing optimism and personal development without relying on the visual clichés common to self-help products. The logo, type system, and core interface language established a foundation that could feel encouraging while still supporting serious instructional content. For the MVP, I translated the Positive Intelligence philosophy into a sequence of manageable interactions. The experience needed to introduce key ideas, give users a clear sense of progression, and create repeatable moments for study and practice. Rapid prototypes explored how lessons, prompts, exercises, and progress cues could fit together without turning the application into a dense course platform. Navigation and content hierarchy were kept straightforward so the founder's teaching remained central, while the brand system gave the product a consistent tone across onboarding and recurring use."
        ]
      },
      {
        "label": "Outcome",
        "paragraphs": [
          "The work produced an initial brand foundation and a V1 product concept that demonstrated how the Positive Intelligence program could operate as a guided digital practice. The prototype gave the founder and team a concrete model for organizing the material, introducing users to the philosophy, and supporting continued engagement beyond the original published content. This project showed how closely brand and product behavior can reinforce each other at the beginning of a company. A logo could establish recognition, but the product earned coherence through pacing, language, and repeated interaction. Designing both together made it possible to test the promise of the brand inside the experience itself and keep a broad philosophy grounded in clear, usable moments."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "obagi",
    "path": "/case-studies/obagi/",
    "collectionPath": "/",
    "title": "Obagi",
    "headline": "A Two-Sided Skincare Commerce Experience",
    "metadata": {
      "client": "Obagi",
      "studio": "Direct with client",
      "year": "2020",
      "role": "UX Design Director"
    },
    "meta": [
      "Obagi",
      "Direct with client",
      "2020",
      "UX Design Director"
    ],
    "summary": "A redesigned skincare experience that unified Obagi's brand, direct ecommerce, product education, and clinician-guided appointment pathways.",
    "media": {
      "label": "Obagi skincare website project image",
      "src": "/images/projects/obagi-screen.png"
    },
    "sections": [
      {
        "label": "Context",
        "paragraphs": [
          "Obagi wanted to redesign its primary website and rethink how its therapeutic skincare brand appeared online. The experience served two related but distinct customer journeys. Some products could be researched and purchased directly through ecommerce, while prescription-dependent products required a consultation with a qualified clinician. The website therefore had to communicate the brand, educate customers, support product discovery, and route people toward either checkout or professional care without making the distinction feel confusing or fragmented."
        ]
      },
      {
        "label": "Work",
        "paragraphs": [
          "Working directly with Obagi as UX Design Director, I oversaw the experience-design effort for the redesign. My role covered research planning, information architecture, user flows, ecommerce and appointment pathways, and the production of UX artifacts used to define the site. I guided the team in translating the refreshed brand direction into an experience that could support both commercial goals and the additional responsibility that comes with clinician-guided products. Research and journey planning focused on the questions customers needed answered before choosing a path: what a product addressed, whether professional consultation was required, and what the next step involved. We mapped the direct-purchase journey from education and product comparison through cart and checkout, then designed a parallel clinician pathway for finding care and booking an appointment. Shared navigation, product language, and visual cues kept those experiences connected while making their different requirements explicit. The redesign also introduced supporting micro-experiences intended to deepen product understanding and encourage return visits. Educational modules, promotional placements, and reusable content patterns could surface routines, ingredients, and related products without interrupting the primary task. Throughout the work, the UX system had to accommodate a broad catalog while preserving a premium, clinically informed brand presence."
        ]
      },
      {
        "label": "Outcome",
        "paragraphs": [
          "The resulting direction unified Obagi's brand, commerce, and clinician pathways within one website framework. Customers could move from learning about a concern to understanding a product and taking the appropriate next step, whether that meant purchasing directly or seeking a consultation. Reusable educational and promotional components gave the internal team a foundation for ongoing campaigns and product storytelling. The central lesson was that two-sided commerce depends on transparent routing. Hiding the difference between direct and prescription products would create friction later, while overemphasizing it could make the experience feel clinical and difficult. The design needed to introduce the distinction at the right moment, preserve momentum, and treat professional guidance as part of the service rather than an obstacle to conversion."
        ]
      }
    ]
  },
  {
    "kind": "project",
    "slug": "gero-app",
    "path": "/case-studies/gero-app/",
    "collectionPath": "/",
    "title": "Gero",
    "headline": "A Pomodoro Companion for Your Wrist",
    "metadata": {
      "client": "USTWO",
      "studio": "ustwo",
      "year": "2015",
      "role": "UI/UX Design"
    },
    "meta": [
      "USTWO",
      "ustwo",
      "2015",
      "UI/UX Design"
    ],
    "summary": "A Pomodoro companion for your wrist, designed natively for Apple Watch to keep focused work and short breaks in rhythm throughout the day.",
    "media": {
      "label": "Gero Timer Pomodoro app for Apple Watch and iPhone",
      "src": "/images/projects/gero-screen.png"
    },
    "sections": [
      {
        "label": "Context",
        "paragraphs": [
          "When Apple Watch launched, ustwo wanted to be among the first studios to ship something meaningful on the platform — not a tech demo, but a real product. Gero (pronounced \"jeer-oh,\" Latin for \"to produce\") was the result: a pomodoro time management app designed natively for Apple Watch with a companion iPhone app. The idea was to take the pomodoro technique — 25-minute work sprints followed by short breaks — and move it from a phone timer you ignore to something on your wrist that keeps you in rhythm throughout the day."
        ]
      },
      {
        "label": "What I Did",
        "paragraphs": [
          "I designed the smartwatch and mobile app interfaces. The core challenge was fitting a workflow that typically lives on a full screen — timers, session counts, break indicators — into the constraints of a watch face. Every interaction had to be glanceable and non-disruptive. The design language drew from a zen mentality — elegant simplicity, nothing that would compete with the focused work the app was supposed to protect. On the phone side, the companion app handled customization — sprint lengths, break durations — so the watch could stay minimal."
        ]
      },
      {
        "label": "The Work",
        "paragraphs": [
          "Gero was one of ustwo's first experiments with WatchKit, and the design pushed what the early SDK could do. The interface used subtle transitions and fluid animations crafted frame by frame to feel natural on the wrist — not flashy, but alive. The app faded into the background during sprints and surfaced only to signal cycle changes with non-intrusive sounds. The goal was to build a subconscious habit rather than demand attention. The hardest part was restraint. A pomodoro app can easily become over-featured — stats dashboards, historical tracking, gamification. Gero deliberately avoided all of that. Start a sprint. Work. Take a break. Repeat. The design had to trust the technique and get out of the way."
        ]
      },
      {
        "label": "What Happened",
        "paragraphs": [
          "Gero shipped as one of the early Apple Watch productivity apps and was featured on Product Hunt. It demonstrated that wearable apps could be more than notification mirrors — they could facilitate real behavioral patterns. For ustwo, it served as both a shipped product and a public case study in designing for a brand new platform with severe constraints."
        ]
      },
      {
        "label": "Looking Back",
        "paragraphs": [
          "Designing for the first generation of Apple Watch was like designing with your hands tied — tiny screen, limited SDK, no established patterns. But that constraint forced clarity. You couldn't rely on any of the usual crutches. Every pixel had to justify itself. That discipline carried forward into everything I designed after."
        ]
      }
    ]
  }
];

const projectDisplayOrder = Object.freeze([
  "avantos",
  "amazon-fire-tv",
  "audible-sleep",
  "turner-tv",
  "obagi",
  "wework-studio",
  "android-wear",
  "live-auctioneers",
  "andrew-eccles",
  "proctor-and-gamble",
  "modern-age",
  "fi-smart-collar",
  "thompson-reuters",
  "gero-app",
  "foursquare",
  "price-waterhouse-coopers",
  "northwestern-mutual",
  "mcdonalds",
  "pi-app",
]);

export const HIDDEN_PROJECT_SLUGS = Object.freeze([
  "obagi",
  "gero-app",
  "northwestern-mutual",
]);

const projectsBySlug = new Map(projectRecords.map((project) => [project.slug, project]));
const orderedProjectRecords = projectDisplayOrder.map((slug) => {
  const project = projectsBySlug.get(slug);
  if (!project) {
    throw new Error("Missing project record for display-order slug " + slug);
  }
  return project;
});

if (orderedProjectRecords.length !== projectRecords.length) {
  throw new Error("Project display order must include every project exactly once");
}

export const ALL_PROJECTS = Object.freeze(orderedProjectRecords.map((project) => {
  const publishedNarrative = PROJECT_NARRATIVES[project.slug];
  if (!publishedNarrative) {
    throw new Error("Missing published narrative for " + project.slug);
  }

  return Object.freeze({
    ...project,
    summary: publishedNarrative.summary,
    metadata: Object.freeze({ ...project.metadata }),
    meta: Object.freeze([...project.meta]),
    media: Object.freeze({
      ...project.media,
      label: project.media.src
        ? project.media.label
        : "Tasman Glacier landscape stand-in for " + project.title,
    }),
    sections: publishedNarrative.sections,
  });
}));

const hiddenProjectSlugs = new Set(HIDDEN_PROJECT_SLUGS);

export const PROJECTS = Object.freeze(
  ALL_PROJECTS.filter((project) => !hiddenProjectSlugs.has(project.slug)),
);

/**
 * Canonical Projects/case-study metadata projection. Both collection cards
 * and project detail headers must use these helpers so their visible content
 * and ordering cannot drift.
 * @param {ProjectRecord} project
 */
export function projectCardTags(project) {
  return [project.metadata.role, project.metadata.year]
    .filter(Boolean);
}

/** @param {ProjectRecord} project */
export function projectCardDescription(project) {
  return project.summary;
}
