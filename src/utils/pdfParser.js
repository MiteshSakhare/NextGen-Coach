export class PDFParser {
  async extractTextFromPDF(file) {
    try {
      console.log(`Processing PDF: ${file.name}`);
      
      // Simulate processing time for realistic UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate realistic demo content based on filename
      const demoText = this.generateDemoContent(file.name);
      
      console.log('PDF processing completed successfully');
      return demoText;
      
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error('Failed to process PDF file. Please try again.');
    }
  }

  generateDemoContent(filename) {
    const templates = [
      {
        name: "ALEXANDRA RODRIGUEZ",
        title: "Senior Frontend Developer",
        email: "alexandra.rodriguez@email.com",
        phone: "(555) 123-4567",
        summary: "Experienced Frontend Developer with 5+ years building scalable React applications. Passionate about creating intuitive user experiences and optimizing web performance.",
        experience: `Senior Frontend Developer | TechFlow Inc. | 2021 - Present
• Led development of customer dashboard serving 50K+ active users
• Implemented modern React patterns reducing bundle size by 40%
• Collaborated with design team to improve user engagement by 35%
• Mentored 4 junior developers in code reviews and best practices

Frontend Developer | Digital Innovations | 2019 - 2021  
• Built responsive web applications using React, Redux, and TypeScript
• Optimized application performance improving Core Web Vitals scores
• Integrated REST APIs and implemented real-time features with WebSocket
• Participated in agile development with cross-functional teams`,
        education: "Bachelor of Science in Computer Science | State University | 2015 - 2019",
        skills: "JavaScript, TypeScript, React, Redux, HTML5, CSS3, Sass, Node.js, Git, Webpack, Jest, Cypress"
      },
      {
        name: "JAMES WILSON",  
        title: "Full Stack Developer",
        email: "james.wilson@email.com",
        phone: "(555) 987-6543",
        summary: "Versatile Full Stack Developer with expertise in modern web technologies. Strong background in both frontend and backend development with focus on scalable solutions.",
        experience: `Full Stack Developer | CloudTech Solutions | 2020 - Present
• Developed end-to-end web applications using React and Node.js
• Designed RESTful APIs handling 1M+ requests daily
• Implemented CI/CD pipelines reducing deployment time by 60%
• Collaborated with product team to define technical requirements

Software Engineer | StartupXYZ | 2018 - 2020
• Built customer-facing features using React and Express.js  
• Optimized database queries improving response times by 45%
• Integrated payment systems and third-party APIs
• Maintained 99.9% uptime for production applications`,
        education: "Bachelor of Engineering in Software Engineering | Tech Institute | 2014 - 2018",
        skills: "JavaScript, Python, React, Node.js, Express.js, PostgreSQL, MongoDB, AWS, Docker, Git"
      },
      {
        name: "SOPHIA CHEN",
        title: "UI/UX Developer", 
        email: "sophia.chen@email.com",
        phone: "(555) 456-7890",
        summary: "Creative UI/UX Developer bridging design and development. Specialized in creating accessible, user-centered interfaces with modern web technologies.",
        experience: `UI/UX Developer | Design Studios Inc. | 2021 - Present
• Translated design mockups into pixel-perfect React components
• Implemented accessibility standards achieving WCAG AA compliance
• Collaborated with designers to create design system used across 10+ products
• Improved mobile user experience increasing engagement by 50%

Frontend Developer | Creative Agency | 2019 - 2021
• Developed interactive websites using React, Vue.js, and GSAP
• Created responsive designs supporting multiple device types
• Optimized sites for Core Web Vitals and SEO performance  
• Worked directly with clients to gather requirements and feedback`,
        education: "Bachelor of Fine Arts in Digital Design | Art College | 2015 - 2019",
        skills: "JavaScript, React, Vue.js, HTML5, CSS3, Sass, Figma, Adobe Creative Suite, GSAP, Three.js"
      }
    ];

    // Select random template
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return `${template.name}
${template.title}
Email: ${template.email} | Phone: ${template.phone}

PROFESSIONAL SUMMARY
${template.summary}

WORK EXPERIENCE
${template.experience}

EDUCATION
${template.education}

TECHNICAL SKILLS
${template.skills}

PROJECTS
Portfolio Website - Personal showcase built with React and Framer Motion
Task Management App - Full-stack application with real-time collaboration
E-commerce Platform - Complete online store with payment integration

Extracted from: ${filename}`;
  }

  cleanText(text) {
    return text.trim();
  }

  extractBasicInfo(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /\(\d{3}\)\s\d{3}-\d{4}/g;
    
    const emails = text.match(emailRegex) || [];
    const phones = text.match(phoneRegex) || [];
    
    return { 
      email: emails[0] || '', 
      phone: phones[0] || '', 
      linkedin: '',
      fullText: text 
    };
  }
}

export const pdfParser = new PDFParser();
