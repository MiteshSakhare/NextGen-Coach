import { GoogleGenerativeAI } from '@google/generative-ai';

// Environment configuration with fallbacks
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://generativelanguage.googleapis.com';
const APP_NAME = import.meta.env.VITE_APP_NAME || 'NextGen Coach';

// Enhanced debug logging (secure)
console.log('🔍 SECURE ENVIRONMENT DEBUG:');
console.log('   MODE:', import.meta.env.MODE);
console.log('   API Key Status:', API_KEY ? 'LOADED' : 'MISSING');
console.log('   API Key Length:', API_KEY ? API_KEY.length : 0);

// Force cache refresh with version
console.log(`🚀 Loading ${APP_NAME} GeminiAPI v4.0 -`, new Date().toISOString());

class GeminiService {
  constructor() {
    console.log('✅ GeminiService v4.0 - Production Ready System');
    this.apiKey = API_KEY;
    this.baseUrl = API_BASE_URL;
    this.appName = APP_NAME;
    this.genAI = null;
    this.model = null;
    this.isInitialized = false;
    
    this.initializeService();
  }

  initializeService() {
    console.log('🔧 === INITIALIZING GEMINI SERVICE ===');
    console.log('   API Key Status:', this.apiKey ? 'Available' : 'Missing from environment');

    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      console.warn('⚠️ Gemini API key not configured. Using fallback mode.');
      console.warn('   Please check your .env file and restart the server');
      this.isInitialized = false;
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.2, // Lower for consistent strict analysis
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        }
      });
      this.isInitialized = true;
      console.log('✅ Gemini AI initialized successfully');
    } catch (error) {
      console.warn('❌ Failed to initialize Gemini AI:', error.message);
      this.isInitialized = false;
    }
  }

  // Utility method to check service status
  getServiceStatus() {
    return {
      initialized: this.isInitialized,
      hasApiKey: !!this.apiKey,
      apiKeyValid: this.apiKey && this.apiKey !== 'your_gemini_api_key_here',
      mode: this.isInitialized ? 'AI-Powered' : 'Fallback'
    };
  }

  // ============================================================================
  // RESUME ANALYSIS - Complete Implementation with Ultra-Strict Detection
  // ============================================================================

  async analyzeResume(resumeText) {
    console.log('🔍 Starting resume analysis...');
    console.log('Service Status:', this.getServiceStatus());
    console.log('Resume text length:', resumeText?.length || 0);
    
    if (!resumeText || resumeText.length < 50) {
      throw new Error('Resume text is too short or empty for analysis');
    }

    const resumeHash = this.createTextHash(resumeText);
    const cacheKey = `resume-analysis-v4-${resumeHash}`;
    
    // Clear old cache versions
    this.clearOldCache(['resume-analysis-v3', 'resume-analysis-v2', 'resume-analysis-fixed']);
    
    const cachedAnalysis = localStorage.getItem(cacheKey);
    if (cachedAnalysis) {
      console.log('✅ Returning cached analysis');
      try {
        const parsed = JSON.parse(cachedAnalysis);
        console.log('Cached scores:', parsed.scores, 'Overall:', parsed.overallScore);
        return parsed;
      } catch (error) {
        console.warn('Cache parsing error, generating new analysis');
      }
    }

    let analysis;
    try {
      if (this.isInitialized) {
        analysis = await this.performAIAnalysisUltraStrict(resumeText);
      } else {
        analysis = this.performAdvancedTextAnalysisUltraStrict(resumeText);
      }
      
      localStorage.setItem(cacheKey, JSON.stringify(analysis));
      console.log('✅ Analysis complete - Overall:', analysis.overallScore, 'ATS:', analysis.atsScore);
      return analysis;
    } catch (error) {
      console.error('Resume analysis error:', error);
      // Fallback to advanced text analysis
      analysis = this.performAdvancedTextAnalysisUltraStrict(resumeText);
      localStorage.setItem(cacheKey, JSON.stringify(analysis));
      return analysis;
    }
  }

  async performAIAnalysisUltraStrict(resumeText) {
    console.log('🤖 Performing Ultra-Strict AI analysis...');
    
    const prompt = `
    You are an EXTREMELY STRICT resume analyst. Analyze this document and determine if it's actually a professional resume.

    🚨 ULTRA-STRICT RULES:
    1. If this is NOT a professional resume (certificate, training, article, etc.) → Give scores 15-30
    2. Only REAL professional resumes with work experience get 50+ scores
    3. Look for CERTIFICATE KILLERS: "certificate", "completion", "awarded", "training", "course", "program"

    Return JSON with this structure:
    {
      "isActualResume": true_or_false,
      "contentType": "resume|certificate|training|article|other",
      "overallScore": number (15-95),
      "scores": {
        "quality": number (15-95),
        "skills": number (15-95),
        "experience": number (15-95),
        "education": number (15-95),
        "format": number (15-95)
      },
      "atsScore": number (20-100),
      "strengths": ["strength1", "strength2", "strength3"],
      "improvements": ["improvement1", "improvement2", "improvement3"],
      "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
    }

    Document to analyze:
    ${resumeText}

    CRITICAL: If you see ANY certificate/training language, immediately classify as non-resume with 15-30 scores!
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisData = JSON.parse(jsonMatch[0]);
        
        // Apply ultra-strict validation
        const strictAnalysis = this.applyUltraStrictValidation(analysisData, resumeText);
        return strictAnalysis;
      } else {
        throw new Error('Invalid AI response format');
      }
    } catch (error) {
      console.warn('AI analysis failed, using ultra-strict text analysis:', error.message);
      return this.performAdvancedTextAnalysisUltraStrict(resumeText);
    }
  }

  applyUltraStrictValidation(data, resumeText) {
    const text = resumeText.toLowerCase();
    
    // ULTRA-STRICT CERTIFICATE DETECTION
    const certificateWords = [
      'certificate', 'certification', 'completion', 'awarded', 'training',
      'course', 'program', 'workshop', 'seminar', 'hereby certify',
      'has successfully completed', 'course completion'
    ];
    
    const certificateMatches = certificateWords.filter(word => text.includes(word));
    
    // Professional resume indicators
    const hasEmail = /@/.test(resumeText);
    const hasPhone = /\d{3}[-.\s]\d{3}[-.\s]\d{4}/.test(resumeText);
    const hasWorkExp = /(?:experience|employment|worked|job|developer|engineer|manager)/i.test(resumeText);
    const hasSkills = /(?:skills|technical|competencies)/i.test(resumeText);
    
    let isActualResume = data.isActualResume !== false;
    let overallScore = data.overallScore || 50;
    let contentType = data.contentType || 'resume';
    
    console.log('🔍 Ultra-strict validation:');
    console.log('   Certificate words found:', certificateMatches.length);
    console.log('   Has work experience:', hasWorkExp);
    console.log('   Has contact info:', hasEmail || hasPhone);
    
    // FORCE REJECTION if certificate language found
    if (certificateMatches.length >= 1) {
      console.log('🚨 CERTIFICATE DETECTED - FORCING LOW SCORES');
      isActualResume = false;
      contentType = 'certificate';
      overallScore = Math.max(15, Math.min(30, 20 + Math.floor(Math.random() * 10)));
    }
    
    // FORCE REJECTION if missing basic resume elements
    if (!hasWorkExp || (!hasEmail && !hasPhone)) {
      console.log('🚨 MISSING RESUME ESSENTIALS - FORCING LOW SCORES');
      isActualResume = false;
      overallScore = Math.max(15, Math.min(30, 18 + Math.floor(Math.random() * 12)));
    }
    
    // Only allow high scores for validated resumes
    if (isActualResume && certificateMatches.length === 0 && hasWorkExp && (hasEmail || hasPhone)) {
      overallScore = Math.max(50, Math.min(95, overallScore));
      console.log('✅ VALIDATED AS REAL RESUME');
    }
    
    return this.sanitizeAnalysisData({
      ...data,
      isActualResume,
      contentType,
      overallScore,
      certificateDetected: certificateMatches.length > 0
    }, resumeText);
  }

  performAdvancedTextAnalysisUltraStrict(resumeText) {
    console.log('📊 Performing Ultra-Strict advanced text analysis...');
    
    const text = resumeText.toLowerCase();
    const lines = resumeText.split('\n').filter(line => line.trim());
    const words = text.split(/\s+/).filter(word => word.length > 2);
    const wordCount = words.length;
    
    // ULTRA-STRICT CERTIFICATE DETECTION
    const certificateWords = ['certificate', 'certification', 'completion', 'awarded', 'training', 'course', 'program'];
    const certificateMatches = certificateWords.filter(word => text.includes(word)).length;
    
    // Resume detection
    const resumeWords = ['experience', 'employment', 'skills', 'developer', 'engineer', 'manager'];
    const resumeMatches = resumeWords.filter(word => text.includes(word)).length;
    
    const hasEmail = /@/.test(resumeText);
    const hasPhone = /\d{3}[-.\s]\d{3}[-.\s]\d{4}/.test(resumeText);
    const hasWorkExp = /(?:experience|employment|worked|job)/i.test(resumeText);
    
    let isActualResume = false;
    let contentType = 'other';
    let overallScore = 25;
    
    console.log('📊 Ultra-strict detection results:');
    console.log('   Certificate matches:', certificateMatches);
    console.log('   Resume matches:', resumeMatches);
    console.log('   Has work experience:', hasWorkExp);
    console.log('   Has contact info:', hasEmail || hasPhone);
    
    // STRICT CLASSIFICATION
    if (certificateMatches >= 1) {
      console.log('🚨 CERTIFICATE DETECTED - LOW SCORES');
      contentType = 'certificate';
      overallScore = 15 + Math.floor(Math.random() * 15); // 15-30
    } else if (resumeMatches >= 3 && hasWorkExp && (hasEmail || hasPhone) && wordCount >= 100) {
      console.log('✅ RESUME VALIDATED - NORMAL SCORES');
      isActualResume = true;
      contentType = 'resume';
      overallScore = 55 + Math.floor(Math.random() * 25); // 55-80
    } else {
      console.log('❌ INSUFFICIENT RESUME CRITERIA - LOW SCORES');
      overallScore = 18 + Math.floor(Math.random() * 12); // 18-30
    }
    
    // Comprehensive analysis (keeping your original logic for actual resumes)
    const sections = this.detectSections(resumeText);
    const skills = this.extractSkills(text);
    const experience = this.analyzeExperience(resumeText);
    const education = this.analyzeEducation(text);
    const formatting = this.analyzeFormatting(resumeText);
    const keywords = this.extractKeywords(text);
    
    // Calculate scores based on classification
    let scores;
    if (isActualResume) {
      scores = {
        quality: this.calculateQualityScore(resumeText, sections, wordCount, skills, keywords),
        skills: this.calculateSkillsScore(skills, text, keywords),
        experience: this.calculateExperienceScore(experience, sections, resumeText),
        education: this.calculateEducationScore(education, sections, text),
        format: this.calculateFormattingScore(formatting, lines, resumeText)
      };
      overallScore = Math.round(Object.values(scores).reduce((a, b) => a + b) / 5);
    } else {
      // Low scores for non-resumes
      scores = {
        quality: Math.max(15, overallScore - 5),
        skills: Math.max(15, overallScore - 10),
        experience: Math.max(15, contentType === 'certificate' ? overallScore - 15 : overallScore - 8),
        education: Math.max(15, contentType === 'certificate' ? overallScore + 20 : overallScore),
        format: Math.max(20, overallScore + 5)
      };
    }
    
    const atsScore = isActualResume ? 
      this.calculateATSScore(resumeText, skills, sections, keywords) : 
      Math.max(20, overallScore + 5);
    
    console.log('🏆 Final ultra-strict scores - Overall:', overallScore, 'ATS:', atsScore, 'Type:', contentType);
    
    const feedback = isActualResume ? 
      this.generateIntelligentFeedback(resumeText, scores, skills, sections, keywords) :
      this.generateNonResumeFeedback(contentType);
    
    return {
      isActualResume,
      contentType,
      overallScore,
      scores,
      atsScore,
      ...feedback,
      analyzedAt: new Date().toISOString(),
      textStats: {
        wordCount,
        lineCount: lines.length,
        sectionsFound: Object.keys(sections).filter(k => sections[k]).length,
        skillsFound: skills.length,
        keywordsFound: keywords.length,
        certificateWords: certificateMatches
      },
      analysisMethod: 'Ultra-Strict Advanced Text Analysis'
    };
  }

  generateNonResumeFeedback(contentType) {
    return {
      strengths: ["Document is readable and well-formatted"],
      improvements: [
        `This appears to be a ${contentType}, not a professional resume`,
        "Please upload an actual resume with work experience and skills",
        "Include standard resume sections: contact info, experience, education, skills"
      ],
      recommendations: [
        "Create a professional resume document with your career information",
        "Include your work experience and key accomplishments",
        "Add education background and relevant technical skills",
        "Use a standard resume format with clear sections"
      ]
    };
  }

  sanitizeAnalysisData(data, resumeText) {
    const words = resumeText.split(/\s+/).filter(word => word.length > 2);
    const lines = resumeText.split('\n').filter(line => line.trim());
    
    // Ensure scores are in valid ranges
    const sanitizedScores = {
      quality: Math.max(15, Math.min(95, data.scores?.quality || (data.isActualResume ? 50 : 25))),
      skills: Math.max(15, Math.min(95, data.scores?.skills || (data.isActualResume ? 45 : 20))),
      experience: Math.max(15, Math.min(95, data.scores?.experience || (data.isActualResume ? 55 : 18))),
      education: Math.max(15, Math.min(95, data.scores?.education || (data.isActualResume ? 60 : 30))),
      format: Math.max(15, Math.min(95, data.scores?.format || (data.isActualResume ? 65 : 35)))
    };
    
    const overallScore = Math.max(15, Math.min(95, data.overallScore || 
      Math.round(Object.values(sanitizedScores).reduce((a, b) => a + b) / 5)));
    
    const atsScore = Math.max(20, Math.min(100, data.atsScore || (data.isActualResume ? 75 : 30)));
    
    return {
      isActualResume: data.isActualResume === true,
      contentType: data.contentType || 'other',
      overallScore,
      scores: sanitizedScores,
      atsScore,
      strengths: Array.isArray(data.strengths) ? data.strengths.slice(0, 5) : 
        (data.isActualResume ? 
          ["Resume shows professional structure", "Contains relevant work experience", "Skills section is present"] :
          ["Document is readable"]),
      improvements: Array.isArray(data.improvements) ? data.improvements.slice(0, 5) : 
        (data.isActualResume ? 
          ["Add more quantified achievements", "Include relevant keywords", "Improve formatting consistency"] :
          [`This is a ${data.contentType}, not a professional resume`, "Upload an actual resume with work experience"]),
      recommendations: Array.isArray(data.recommendations) ? data.recommendations.slice(0, 5) : 
        (data.isActualResume ? 
          ["Use action verbs to start bullet points", "Quantify achievements with numbers", "Tailor keywords to job descriptions"] :
          ["Create a professional resume", "Include work experience and skills"]),
      analyzedAt: new Date().toISOString(),
      textStats: {
        wordCount: words.length,
        lineCount: lines.length,
        sectionsFound: this.detectSections(resumeText),
        skillsFound: this.extractSkills(resumeText.toLowerCase()).length,
        certificateDetected: data.certificateDetected || false
      },
      analysisMethod: data.analysisMethod || 'Ultra-Strict AI Analysis'
    };
  }

  // Keep all your existing methods exactly the same below this line
  calculateQualityScore(resumeText, sections, wordCount, skills, keywords) {
    let score = 35; // Base score
    
    // Word count scoring (0-20 points)
    if (wordCount >= 300 && wordCount <= 800) score += 20;
    else if (wordCount >= 200 && wordCount <= 1000) score += 15;
    else if (wordCount >= 150) score += 10;
    else score += 5;
    
    // Section completeness (0-20 points)
    const sectionCount = Object.values(sections).filter(Boolean).length;
    score += Math.min(sectionCount * 3, 20);
    
    // Content quality indicators (0-20 points)
    const achievementWords = (resumeText.match(/(?:achieved|improved|increased|managed|led|developed|created|implemented|designed|built|launched|optimized|streamlined)/gi) || []).length;
    score += Math.min(achievementWords * 2, 20);
    
    // Quantified results (0-15 points)
    const quantifiers = (resumeText.match(/\d+(?:%|\$|k|million|thousand|years?|months?|projects?|clients?|team|people)/gi) || []).length;
    score += Math.min(quantifiers * 3, 15);
    
    return Math.min(score, 95);
  }

  calculateSkillsScore(skills, text, keywords) {
    let score = 25; // Base score
    
    // Number of skills (0-25 points)
    score += Math.min(skills.length * 2, 25);
    
    // Skill diversity (0-25 points)
    const categories = this.categorizeSkills(skills);
    score += Math.min(Object.keys(categories).length * 5, 25);
    
    // Keyword relevance (0-25 points)
    score += Math.min(keywords.length, 25);
    
    return Math.min(score, 95);
  }

  calculateExperienceScore(experience, sections, resumeText) {
    let score = 30; // Base score
    
    // Has experience section (0-25 points)
    if (sections.experience) score += 25;
    
    // Years mentioned (0-20 points)
    const yearMatches = resumeText.match(/(\d+)\+?\s*(?:years?|yrs)/gi) || [];
    if (yearMatches.length > 0) {
      const maxYears = Math.max(...yearMatches.map(m => parseInt(m.match(/\d+/)[0])));
      score += Math.min(maxYears * 3, 20);
    }
    
    // Job titles and companies (0-20 points)
    const jobTitles = (resumeText.match(/(?:developer|engineer|manager|analyst|specialist|coordinator|assistant|intern|consultant|director|lead|senior|junior)/gi) || []).length;
    score += Math.min(jobTitles * 4, 20);
    
    return Math.min(score, 95);
  }

  calculateEducationScore(education, sections, text) {
    let score = 35; // Base score
    
    // Has education section (0-30 points)
    if (sections.education) score += 30;
    
    // Education level (0-30 points)
    const eduLevel = this.getEducationLevel(text);
    score += eduLevel;
    
    return Math.min(score, 95);
  }

  calculateFormattingScore(formatting, lines, resumeText) {
    let score = 40; // Base score
    
    // Appropriate length (0-20 points)
    if (lines.length >= 20 && lines.length <= 80) score += 20;
    else if (lines.length >= 15 && lines.length <= 100) score += 15;
    else score += 10;
    
    // Structure indicators (0-35 points)
    if (/(?:EXPERIENCE|EDUCATION|SKILLS)/gi.test(resumeText)) score += 15;
    if (/(?:@|email|phone|linkedin)/gi.test(resumeText)) score += 10;
    if (/\d{4}/gi.test(resumeText)) score += 10;
    
    return Math.min(score, 95);
  }

  calculateATSScore(resumeText, skills, sections, keywords) {
    let score = 50; // Base score
    
    // Keyword density (0-25 points)
    score += Math.min(keywords.length * 2, 25);
    
    // Essential sections (0-25 points)
    const essentialSections = ['experience', 'education', 'skills'].filter(s => sections[s]).length;
    score += essentialSections * 8;
    
    return Math.min(score, 100);
  }

  // Enhanced helper methods
  detectSections(resumeText) {
    const text = resumeText.toLowerCase();
    return {
      summary: /(?:summary|profile|about|objective)/i.test(text),
      experience: /(?:experience|work|employment|career|professional|history)/i.test(text),
      education: /(?:education|academic|degree|university|college|school)/i.test(text),
      skills: /(?:skills|competencies|technologies|technical|proficiencies)/i.test(text),
      projects: /(?:projects|portfolio|work samples)/i.test(text),
      certifications: /(?:certifications|certificates|licenses|credentials)/i.test(text),
      contact: /(?:contact|phone|email|address|linkedin|github)/i.test(text),
      achievements: /(?:achievements|awards|honors|recognition)/i.test(text)
    };
  }

  extractSkills(text) {
    const skillsList = [
      // Programming Languages
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'kotlin', 'swift',
      // Web Technologies
      'react', 'angular', 'vue', 'nodejs', 'express', 'html', 'css', 'sass', 'scss', 'tailwind',
      // Databases
      'mongodb', 'mysql', 'postgresql', 'redis', 'sqlite', 'oracle', 'firebase',
      // Cloud & DevOps
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible',
      // Tools & Frameworks
      'git', 'github', 'gitlab', 'jira', 'confluence', 'figma', 'sketch', 'photoshop',
      // Data & Analytics
      'sql', 'tableau', 'power bi', 'excel', 'r', 'matlab', 'pandas', 'numpy',
      // Soft Skills
      'leadership', 'communication', 'teamwork', 'management', 'problem solving', 'analytical thinking'
    ];
    
    return skillsList.filter(skill => text.includes(skill.toLowerCase()));
  }

  extractKeywords(text) {
    const keywords = [
      'agile', 'scrum', 'api', 'rest', 'microservices', 'ci/cd', 'testing', 'debugging',
      'optimization', 'performance', 'scalability', 'security', 'authentication', 'authorization'
    ];
    
    return keywords.filter(keyword => text.includes(keyword.toLowerCase()));
  }

  categorizeSkills(skills) {
    const categories = {
      programming: ['javascript', 'python', 'java', 'typescript'],
      frameworks: ['react', 'angular', 'vue', 'nodejs'],
      databases: ['mongodb', 'mysql', 'postgresql'],
      cloud: ['aws', 'azure', 'gcp', 'docker'],
      tools: ['git', 'jira', 'figma']
    };
    
    const result = {};
    Object.keys(categories).forEach(category => {
      const categorySkills = skills.filter(skill => 
        categories[category].some(catSkill => skill.includes(catSkill))
      );
      if (categorySkills.length > 0) {
        result[category] = categorySkills;
      }
    });
    
    return result;
  }

  getEducationLevel(text) {
    if (text.includes('phd') || text.includes('doctorate')) return 30;
    if (text.includes('master') || text.includes('mba')) return 25;
    if (text.includes('bachelor') || text.includes('degree')) return 20;
    if (text.includes('diploma') || text.includes('certificate')) return 15;
    return 10;
  }

  analyzeExperience(resumeText) {
    return {
      yearMatches: (resumeText.match(/(\d+)\s*(?:years?|yrs)/gi) || []).length,
      hasActionVerbs: /(?:managed|led|developed|created|implemented|designed|built|achieved|improved|increased)/gi.test(resumeText),
      hasQuantifiers: /\d+(?:%|\$|k|million)/gi.test(resumeText)
    };
  }

  analyzeEducation(text) {
    const eduKeywords = ['bachelor', 'master', 'degree', 'university', 'college', 'certification', 'diploma', 'phd', 'mba'];
    return eduKeywords.filter(kw => text.includes(kw)).length;
  }

  analyzeFormatting(resumeText) {
    return {
      hasProperSections: /(?:EXPERIENCE|EDUCATION|SKILLS)/gi.test(resumeText),
      hasContactInfo: /(?:@|phone|email|linkedin)/gi.test(resumeText),
      reasonableLength: resumeText.length > 500 && resumeText.length < 8000,
      hasNumbers: /\d/.test(resumeText),
      hasDates: /\d{4}/.test(resumeText),
      hasBulletPoints: /[•\-*]/.test(resumeText)
    };
  }

  generateIntelligentFeedback(resumeText, scores, skills, sections, keywords) {
    const strengths = [];
    const improvements = [];
    const recommendations = [];
    
    // Dynamic strengths based on scores
    if (scores.experience >= 70) strengths.push("Strong professional experience with clear career progression");
    if (skills.length >= 10) strengths.push("Comprehensive skill set covering multiple technical areas");
    if (sections.education && sections.experience && sections.skills) strengths.push("Well-structured resume with all essential sections");
    if (scores.format >= 75) strengths.push("Professional formatting optimized for ATS systems");
    if (/\d+(?:%|\$|projects|clients)/gi.test(resumeText)) strengths.push("Includes quantified achievements and measurable results");
    
    // Dynamic improvements based on weak areas
    if (scores.quality < 65) improvements.push("Enhance content with more specific achievements and impact statements");
    if (skills.length < 8) improvements.push("Add more relevant technical and industry-specific skills");
    if (!sections.summary) improvements.push("Include a compelling professional summary or objective statement");
    if (scores.format < 70) improvements.push("Improve formatting consistency and visual hierarchy");
    if (!/\d+(?:%|\$|k)/gi.test(resumeText)) improvements.push("Add quantified results using numbers, percentages, and metrics");
    if (keywords.length < 5) improvements.push("Include more industry-relevant keywords and buzzwords");
    
    // Intelligent recommendations
    recommendations.push("Use strong action verbs to begin each accomplishment (managed, developed, achieved, optimized)");
    recommendations.push("Quantify achievements with specific numbers, percentages, and dollar amounts");
    recommendations.push("Tailor keywords and skills to match target job descriptions");
    recommendations.push("Include relevant certifications, training, and professional development");
    recommendations.push("Optimize for ATS systems while maintaining human readability");
    recommendations.push("Keep resume concise but comprehensive (1-2 pages for most roles)");
    
    // Fallbacks
    if (strengths.length === 0) strengths.push("Resume demonstrates relevant professional background and skills");
    if (improvements.length === 0) improvements.push("Consider adding more quantified achievements to strengthen impact");
    
    return { strengths, improvements, recommendations };
  }

  // ============================================================================
  // INTERVIEW SIMULATION (Keep all your existing methods)
  // ============================================================================

  async generateInterviewQuestions(jobRole, experienceLevel, skills) {
    console.log('🎤 Generating interview questions...');
    
    if (this.isInitialized) {
      try {
        return await this.generateAIInterviewQuestions(jobRole, experienceLevel, skills);
      } catch (error) {
        console.warn('AI interview generation failed, using fallback');
      }
    }
    
    return this.generateFallbackQuestions(jobRole, experienceLevel, skills);
  }

  async generateAIInterviewQuestions(jobRole, experienceLevel, skills) {
    const prompt = `Generate 7 interview questions for a ${experienceLevel} level ${jobRole} position with skills in ${skills.join(', ')}. 
    
    Return JSON format:
    [
      {
        "question": "question text",
        "type": "behavioral|technical|situational",
        "difficulty": "easy|medium|hard"
      }
    ]
    
    Include a mix of behavioral, technical, and situational questions appropriate for the experience level.`;
    
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid AI response format');
  }

  generateFallbackQuestions(jobRole, experienceLevel, skills) {
    const skillsText = skills.length > 0 ? skills.slice(0, 3).join(', ') : 'your technical skills';
    
    const questions = [
      { 
        question: `Tell me about yourself and your background in ${jobRole}.`, 
        type: 'behavioral', 
        difficulty: 'easy' 
      },
      { 
        question: `What interests you about this ${jobRole} position and our company?`, 
        type: 'behavioral', 
        difficulty: 'easy' 
      },
      { 
        question: `Describe a challenging project where you used ${skillsText}. What was your approach and what did you learn?`, 
        type: 'technical', 
        difficulty: 'medium' 
      },
      { 
        question: `How do you handle tight deadlines and competing priorities? Give me a specific example.`, 
        type: 'situational', 
        difficulty: 'medium' 
      },
      { 
        question: `Tell me about a time you had to learn a new technology or skill quickly for a project.`, 
        type: 'behavioral', 
        difficulty: 'medium' 
      },
      { 
        question: `Where do you see yourself professionally in 3-5 years, and how does this role fit into those plans?`, 
        type: 'behavioral', 
        difficulty: 'easy' 
      },
      { 
        question: `Describe a situation where you disagreed with a team member or supervisor. How did you handle it?`, 
        type: 'situational', 
        difficulty: 'medium' 
      }
    ];
    
    return questions;
  }

  async conductInterview(question, answer, context) {
    console.log('🎯 Conducting interview assessment...');
    
    if (this.isInitialized && answer.length > 20) {
      try {
        return await this.conductAIInterview(question, answer, context);
      } catch (error) {
        console.warn('AI interview assessment failed, using fallback');
      }
    }
    
    return this.conductFallbackInterview(question, answer, context);
  }

  async conductAIInterview(question, answer, context) {
    const prompt = `Evaluate this interview response and provide feedback:
    Question: ${question}
    Answer: ${answer}
    Context: ${context?.jobRole || 'General'} position
    Return JSON format:
    {
      "score": number (1-10),
      "feedback": "detailed feedback on the response",
      "tips": ["tip1", "tip2", "tip3"]
    }
    Evaluate based on relevance, completeness, examples used, and communication clarity.`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const evaluation = JSON.parse(jsonMatch[0]);
      return {
        score: Math.max(1, Math.min(10, evaluation.score || 5)),
        feedback: evaluation.feedback || "Good response with room for improvement.",
        tips: Array.isArray(evaluation.tips) ? evaluation.tips.slice(0, 3) : 
          ["Provide more specific examples", "Use the STAR method", "Show enthusiasm"]
      };
    }
    
    throw new Error('Invalid AI response format');
  }

  conductFallbackInterview(question, answer, context) {
    const score = this.calculateAnswerScore(answer, question);
    const feedback = this.generateSmartFeedback(answer, question, score);
    const tips = this.generateContextualTips(answer, question);
    
    return { score, feedback, tips };
  }

  calculateAnswerScore(answer, question) {
    let score = 3; // Base score
    const wordCount = answer.trim().split(/\s+/).length;
    const answerLower = answer.toLowerCase();
    
    // Length scoring (0-2 points)
    if (wordCount >= 50 && wordCount <= 200) score += 2;
    else if (wordCount >= 25 && wordCount <= 300) score += 1.5;
    else if (wordCount >= 15) score += 1;
    
    // Content quality (0-3 points)
    if (answerLower.includes('example')) score += 0.8;
    if (answerLower.includes('result') || answerLower.includes('outcome')) score += 0.7;
    if (answerLower.includes('learned') || answerLower.includes('experience')) score += 0.5;
    if (/\d+/.test(answer)) score += 0.5;
    if (answerLower.includes('team') || answerLower.includes('collaborate')) score += 0.5;
    
    // STAR method indicators (0-2 points)
    if (question.toLowerCase().includes('tell me about') || question.toLowerCase().includes('describe')) {
      if (answerLower.includes('situation') || answerLower.includes('when')) score += 0.5;
      if (answerLower.includes('action') || answerLower.includes('did') || answerLower.includes('approach')) score += 0.5;
      if (answerLower.includes('result') || answerLower.includes('outcome') || answerLower.includes('achieved')) score += 1;
    }
    
    return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
  }

  generateSmartFeedback(answer, question, score) {
    if (score >= 8.5) return "Excellent response! Comprehensive, well-structured, and demonstrates strong competency.";
    if (score >= 7) return "Very good answer! Shows clear understanding with relevant examples and good structure.";
    if (score >= 5.5) return "Good response with solid content. Consider adding more specific examples and quantifiable results.";
    if (score >= 4) return "Decent answer but could be enhanced. Focus on providing more detailed examples and clearer outcomes.";
    return "Your response needs improvement. Consider using the STAR method and including specific examples with measurable results.";
  }

  generateContextualTips(answer, question) {
    const tips = [];
    const answerLower = answer.toLowerCase();
    
    if (answer.length < 150) tips.push("Provide more comprehensive explanations with additional details");
    if (!answerLower.includes('example')) tips.push("Include specific, real-world examples from your experience");
    if (!/\d+/.test(answer)) tips.push("Add quantifiable results and metrics when possible");
    if (!answerLower.includes('learn')) tips.push("Mention key learnings or insights gained");
    
    // Always include these essential tips
    tips.push("Use the STAR method: Situation, Task, Action, Result");
    tips.push("Show enthusiasm and genuine interest in the role");
    tips.push("Connect your experience to the company's needs and values");
    
    return tips.slice(0, 4);
  }

  // ============================================================================
  // JOB MATCHING (Keep all your existing methods)
  // ============================================================================

  async matchJobs(skills, experienceLevel, preferences) {
    console.log('💼 Matching jobs for skills:', skills);
    
    try {
      const jobs = await this.generateMatchedJobs(skills, experienceLevel, preferences);
      return jobs.sort((a, b) => b.matchPercentage - a.matchPercentage);
    } catch (error) {
      console.error('Job matching error:', error);
      return this.generateFallbackJobs(skills, experienceLevel, preferences);
    }
  }

  async generateMatchedJobs(skills, experienceLevel, preferences) {
    const jobTitles = this.generateJobTitles(skills, experienceLevel);
    const companies = [
      'TechCorp Solutions', 'InnovateLab Inc.', 'Digital Dynamics', 'FutureWork Technologies',
      'CloudScale Systems', 'DataDriven Co.', 'AgileMinds', 'NextGen Enterprises',
      'SmartSolutions Ltd.', 'CodeCraft Industries', 'TechVision Group', 'DevForce Labs'
    ];
    
    const locations = preferences?.location ? [preferences.location] : 
      ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Remote', 'Boston, MA', 'Denver, CO'];
    
    const jobs = [];
    for (let i = 0; i < 8; i++) {
      const job = {
        jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
        company: companies[Math.floor(Math.random() * companies.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        salaryRange: this.generateSalaryRange(experienceLevel, preferences),
        matchPercentage: this.calculateJobMatch(skills, experienceLevel),
        requiredSkills: this.selectRelevantSkills(skills),
        description: this.generateJobDescription(jobTitles[0], skills),
        growthPotential: this.getGrowthPotential(),
        whyMatch: this.generateMatchReason(skills, experienceLevel),
        remote: preferences?.remote || Math.random() > 0.6,
        postedDays: Math.floor(Math.random() * 14) + 1,
        benefits: this.generateBenefits(),
        companySize: this.getCompanySize()
      };
      jobs.push(job);
    }
    
    return jobs;
  }

  generateJobTitles(skills, experienceLevel) {
    const levelPrefix = this.getLevelPrefix(experienceLevel);
    const baseTitles = [];
    
    // Generate titles based on skills
    if (skills.some(s => s.includes('react') || s.includes('angular') || s.includes('vue'))) {
      baseTitles.push(`${levelPrefix}Frontend Developer`, `${levelPrefix}React Developer`);
    }
    if (skills.some(s => s.includes('node') || s.includes('python') || s.includes('java'))) {
      baseTitles.push(`${levelPrefix}Backend Developer`, `${levelPrefix}Full Stack Developer`);
    }
    if (skills.some(s => s.includes('data') || s.includes('analytics') || s.includes('sql'))) {
      baseTitles.push(`${levelPrefix}Data Analyst`, `${levelPrefix}Data Scientist`);
    }
    if (skills.some(s => s.includes('aws') || s.includes('cloud') || s.includes('devops'))) {
      baseTitles.push(`${levelPrefix}DevOps Engineer`, `${levelPrefix}Cloud Engineer`);
    }
    
    // Default titles if no specific matches
    if (baseTitles.length === 0) {
      baseTitles.push(
        `${levelPrefix}Software Developer`,
        `${levelPrefix}Software Engineer`,
        `${levelPrefix}Full Stack Developer`
      );
    }
    
    return [...new Set(baseTitles)];
  }

  getLevelPrefix(experienceLevel) {
    switch (experienceLevel) {
      case 'senior': return 'Senior ';
      case 'mid': return '';
      case 'entry': return 'Junior ';
      default: return '';
    }
  }

  generateSalaryRange(experienceLevel, preferences) {
    const baseSalary = {
      entry: { min: 65000, max: 85000 },
      mid: { min: 85000, max: 120000 },
      senior: { min: 120000, max: 180000 }
    };
    
    const range = baseSalary[experienceLevel] || baseSalary.mid;
    const variation = 0.15; // 15% variation
    
    const min = Math.round(range.min * (1 - variation + Math.random() * variation));
    const max = Math.round(range.max * (1 - variation + Math.random() * variation));
    
    return `$${Math.round(min/1000)}k - $${Math.round(max/1000)}k`;
  }

  calculateJobMatch(skills, experienceLevel) {
    const baseMatch = {
      entry: 75,
      mid: 80,
      senior: 85
    };
    
    const base = baseMatch[experienceLevel] || 75;
    const skillBonus = Math.min(skills.length * 2, 15);
    const randomVariation = Math.floor(Math.random() * 10) - 5;
    
    return Math.max(65, Math.min(98, base + skillBonus + randomVariation));
  }

  selectRelevantSkills(skills) {
    const selected = skills.slice(0, 6);
    const additionalSkills = ['Problem Solving', 'Team Collaboration', 'Agile Methodology'];
    
    while (selected.length < 5 && additionalSkills.length > 0) {
      selected.push(additionalSkills.shift());
    }
    
    return selected;
  }

  generateJobDescription(jobTitle, skills) {
    const descriptions = [
      `Join our innovative team building next-generation applications with ${skills.slice(0, 2).join(' and ')}.`,
      `Exciting opportunity to work on cutting-edge projects using modern technologies including ${skills[0]}.`,
      `We're looking for a talented professional to help us scale our platform using ${skills.slice(0, 3).join(', ')}.`,
      `Great opportunity to make an impact in a fast-growing company with expertise in ${skills[0]} and ${skills[1] || 'modern web technologies'}.`
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  getGrowthPotential() {
    const options = ['High', 'Very High', 'Exceptional', 'Strong'];
    return options[Math.floor(Math.random() * options.length)];
  }

  generateMatchReason(skills, experienceLevel) {
    const reasons = [
      `Perfect match for your ${skills[0]} expertise and ${experienceLevel} experience level.`,
      `Strong alignment with your technical skills in ${skills.slice(0, 2).join(' and ')}.`,
      `Great opportunity to leverage your ${experienceLevel}-level experience with ${skills[0]}.`,
      `Excellent fit based on your background in ${skills.slice(0, 3).join(', ')}.`
    ];
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  generateBenefits() {
    const allBenefits = [
      'Health Insurance', 'Dental Coverage', 'Vision Care', '401(k) Matching',
      'Flexible Hours', 'Remote Work', 'Professional Development', 'Stock Options',
      'Paid Time Off', 'Parental Leave', 'Gym Membership', 'Learning Budget'
    ];
    
    return allBenefits.sort(() => 0.5 - Math.random()).slice(0, 5);
  }

  getCompanySize() {
    const sizes = ['Startup (1-50)', 'Small (51-200)', 'Medium (201-1000)', 'Large (1000+)'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }

  generateFallbackJobs(skills, experienceLevel, preferences) {
    return this.generateMatchedJobs(skills, experienceLevel, preferences);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  createTextHash(text) {
    let hash = 0;
    if (text.length === 0) return hash.toString();
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString();
  }

  clearOldCache(oldKeys) {
    oldKeys.forEach(key => {
      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i);
        if (storageKey && storageKey.includes(key)) {
          localStorage.removeItem(storageKey);
        }
      }
    });
  }

  // Health check method
  async healthCheck() {
    return {
      status: this.isInitialized ? 'healthy' : 'degraded',
      apiKey: !!this.apiKey,
      timestamp: new Date().toISOString(),
      version: '4.0',
      mode: this.isInitialized ? 'AI-Powered Ultra-Strict' : 'Fallback Ultra-Strict'
    };
  }
}

export const geminiService = new GeminiService();

// Export health check for debugging
export const checkGeminiHealth = () => geminiService.healthCheck();
