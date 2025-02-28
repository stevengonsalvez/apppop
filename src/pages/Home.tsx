import React, { useEffect, useRef } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  useTheme,
  useMediaQuery,
  Stack,
  Divider
} from '@mui/material';
import { motion, useAnimation, useInView } from 'framer-motion';
import { 
  Code as CodeIcon, 
  Security as SecurityIcon, 
  Devices as DevicesIcon,
  CloudDone as CloudDoneIcon,
  Speed as SpeedIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';
import { alpha, keyframes } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);
const MotionCard = motion(Card);

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(254, 107, 139, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(254, 107, 139, 0); }
  100% { box-shadow: 0 0 0 0 rgba(254, 107, 139, 0); }
`;

const glow = keyframes`
  0% { filter: drop-shadow(0 0 2px rgba(144, 202, 249, 0.2)); }
  50% { filter: drop-shadow(0 0 10px rgba(144, 202, 249, 0.8)); }
  100% { filter: drop-shadow(0 0 2px rgba(144, 202, 249, 0.2)); }
`;

const breathe = keyframes`
  0% { background-size: 80%; }
  50% { background-size: 85%; }
  100% { background-size: 80%; }
`;

const marqueeAnimation = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

// Animation keyframes for feature cards
const popIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5, 0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1, 1);
  }
`;

const slideIn = keyframes`
  0% {
    opacity: 0;
    transform: translate(2em, 0);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
`;

const slideUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(1.5em);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const features = [
  {
    icon: <CodeIcon fontSize="small" />,
    title: "React & TypeScript",
    description: "Modern frontend with full type safety"
  },
  {
    icon: <SecurityIcon fontSize="small" />,
    title: "Supabase Backend",
    description: "PostgreSQL database with realtime subscriptions"
  },
  {
    icon: <DevicesIcon fontSize="small" />,
    title: "Native iOS & Android",
    description: "Build once, deploy everywhere with Capacitor"
  },
  {
    icon: <CloudDoneIcon fontSize="small" />,
    title: "Auth & Profiles",
    description: "Complete user management system built-in"
  },
  {
    icon: <SpeedIcon fontSize="small" />,
    title: "Material UI",
    description: "Beautiful, responsive components out of the box"
  },
  {
    icon: <GitHubIcon fontSize="small" />,
    title: "CI/CD Pipeline",
    description: "GitHub Actions for automated testing and deployment"
  },
  {
    icon: <CodeIcon fontSize="small" />,
    title: "Analytics",
    description: "Google Analytics and Microsoft Clarity integration"
  },
  {
    icon: <SecurityIcon fontSize="small" />,
    title: "Stripe Payments",
    description: "Ready-to-use subscription and payment system"
  },
  {
    icon: <DevicesIcon fontSize="small" />,
    title: "Timeline & Stories",
    description: "Social media style components included"
  },
  {
    icon: <CloudDoneIcon fontSize="small" />,
    title: "SEO Optimized",
    description: "Best practices for search engine visibility"
  },
  {
    icon: <SpeedIcon fontSize="small" />,
    title: "Dark/Light Mode",
    description: "Theme system with customizable colors"
  },
  {
    icon: <GitHubIcon fontSize="small" />,
    title: "Open Source",
    description: "100% open source, no vendor lock-in"
  }
];

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}> = ({ icon, title, description, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();
  const theme = useTheme();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <MotionCard
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.4, 
            delay: index * 0.05,
            ease: "easeOut" 
          }
        }
      }}
      whileHover={{ 
        y: -8,
        boxShadow: theme.shadows[6],
        transition: { duration: 0.2 }
      }}
      sx={{
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: theme.shadows[2],
        position: 'relative',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          opacity: 0.7,
        },
        '&:hover': {
          '& .feature-icon': {
            transform: 'scale(1.2) rotate(5deg)',
            color: theme.palette.primary.main,
          },
          '& .feature-title': {
            color: theme.palette.primary.main,
          }
        }
      }}
    >
      <CardContent sx={{ p: 2, height: '100%' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 1.5,
          }}
        >
          <Box 
            className="feature-icon"
            sx={{ 
              mr: 1.5,
              color: theme.palette.text.secondary,
              transition: 'all 0.3s ease',
            }}
          >
            {icon}
          </Box>
          <Typography 
            variant="subtitle1" 
            component="h3" 
            className="feature-title"
            sx={{ 
              fontWeight: 'bold',
              transition: 'color 0.3s ease',
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            fontSize: '0.8rem',
            lineHeight: 1.4,
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </MotionCard>
  );
};

export const HomePage: React.FC = () => {
  const theme = useTheme();
  const history = useHistory();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const heroControls = useAnimation();
  const featureControls = useAnimation();
  
  useEffect(() => {
    const sequence = async () => {
      await heroControls.start('visible');
      await featureControls.start('visible');
    };
    
    sequence();
  }, [heroControls, featureControls]);

  return (
    <Box sx={{ 
      bgcolor: 'background.default',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 'auto', md: '100vh' },
          minHeight: { xs: 500, md: 700 },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          pt: { xs: 8, md: 0 },
          pb: { xs: 8, md: 0 },
          backgroundImage: 'url("https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop")',
          backgroundSize: '80%',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
          animation: `${breathe} 15s infinite ease-in-out`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: alpha(theme.palette.background.default, 0.7),
            zIndex: 0,
          },
        }}
      >
        {/* Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3, transition: { duration: 1.5 } }}
            sx={{
              position: 'absolute',
              top: '-10%',
              right: '-5%',
              width: { xs: 300, md: 500 },
              height: { xs: 300, md: 500 },
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              filter: 'blur(60px)',
              animation: `${float} 6s ease-in-out infinite`,
            }}
          />
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3, transition: { duration: 1.5, delay: 0.3 } }}
            sx={{
              position: 'absolute',
              bottom: '-10%',
              left: '-5%',
              width: { xs: 250, md: 400 },
              height: { xs: 250, md: 400 },
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              filter: 'blur(60px)',
              animation: `${float} 7s ease-in-out infinite reverse`,
            }}
          />
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                initial="hidden"
                animate={heroControls}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { duration: 0.5 } }
                }}
              >
                <MotionTypography
                  variant="h2"
                  sx={{ 
                    fontWeight: 800,
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.7, delay: 0.2 }
                  }}
                >
                  AppPop
                </MotionTypography>
                
                <MotionTypography
                  variant="h4"
                  sx={{ 
                    fontWeight: 700,
                    mb: 3,
                    color: theme.palette.text.primary
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.7, delay: 0.4 }
                  }}
                >
                  Native Apps & SaaS in One Stack
                </MotionTypography>
                
                <MotionTypography
                  variant="body1"
                  sx={{ 
                    mb: 4,
                    fontSize: '1.1rem',
                    color: theme.palette.text.secondary,
                    maxWidth: 500
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.7, delay: 0.6 }
                  }}
                >
                  Build iOS, Android, and web apps from a single codebase. 
                  Launch your product faster with our complete, open-source 
                  starter kit optimized for SEO and performance.
                </MotionTypography>
                
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
                  sx={{ mb: 4 }}
                >
                  <MotionButton
                    variant="contained"
                    size="large"
                    onClick={() => window.location.href = '/app/login'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { duration: 0.7, delay: 0.8 }
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      px: 3,
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                      animation: `${pulse} 2s infinite`,
                    }}
                  >
                    Sign In to See Demo App
                  </MotionButton>
                  
                  <MotionButton
                    variant="outlined"
                    size="large"
                    onClick={() => window.open('https://github.com/stevengonsalvez/apppop', '_blank')}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { duration: 0.7, delay: 1 }
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    startIcon={<GitHubIcon />}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      px: 3,
                      fontWeight: 'bold',
                      borderWidth: 2,
                    }}
                  >
                    GitHub
                  </MotionButton>
                </Stack>
              </MotionBox>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { duration: 0.8, delay: 0.5 }
                }}
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: { xs: 4, md: 0 }
                }}
              >
                {/* Newton's Cradle */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 5
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      maxWidth: 900,
                      height: 350,
                      marginBottom: 8, // Add more space below for the pendulums and labels
                      overflow: 'visible'
                    }}
                  >
                    {/* Ceiling Bar */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: '2%',
                        right: '2%',
                        height: 12,
                        bgcolor: 'grey.800',
                        borderRadius: 4,
                        boxShadow: '0px 4px 8px rgba(0,0,0,0.5)',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: -5,
                          left: '5%',
                          right: '5%',
                          height: 5,
                          bgcolor: 'grey.900',
                          borderRadius: '4px 4px 0 0',
                          opacity: 0.7
                        }
                      }}
                    />
                    
                    {/* Pendulums */}
                    {[
                      { name: 'React', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg', color: '#61DAFB' },
                      { name: 'TypeScript', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg', color: '#007ACC' },
                      { name: 'Supabase', logo: 'https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png', color: '#3ECF8E' },
                      { name: 'Capacitor', logo: 'https://seeklogo.com/images/C/capacitor-logo-DF3634DD70-seeklogo.com.png', color: '#53B9FF' },
                      { name: 'Material UI', logo: 'https://mui.com/static/logo.png', color: '#0081CB' },
                      { name: 'Stripe', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg', color: '#635BFF' },
                      { name: 'Analytics', logo: 'https://www.vectorlogo.zone/logos/google_analytics/google_analytics-icon.svg', color: '#E37400' },
                      { name: 'Clarity', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwI7m9gSh1Jh9ZqcIm21fR2xi_rVStZcCPBA&s', color: '#008575' },
                      { name: 'Vite', logo: 'https://vitejs.dev/logo.svg', color: '#646CFF' },
                      { name: 'Actions', logo: 'https://github.githubassets.com/images/modules/site/features/actions-icon-actions.svg', color: '#2088FF' },
                      { name: 'Playwright', logo: 'https://playwright.dev/img/playwright-logo.svg', color: '#2EAD33' },
                      { name: 'Sentry', logo: 'https://cdn.worldvectorlogo.com/logos/sentry-3.svg', color: '#362D59' },
                      { name: 'Ionic', logo: 'https://ionicframework.com/img/meta/logo.png', color: '#3880FF' }
                    ].map((tech, index, arr) => {
                      const isFirst = index === 0;
                      const isLast = index === arr.length - 1;
                      const isMid = !isFirst && !isLast;
                      
                      // Random height factor for each pendulum (between 180px and 260px)
                      const heightFactor = 180 + (index % 5) * 20;
                      
                      // Create unique swinging animation for each pendulum
                      const swingAnimation = keyframes`
                        0% { transform: rotate(${-5 - (index % 3) * 5}deg); }
                        ${25 + (index * 5) % 20}% { transform: rotate(${5 + (index % 4) * 5}deg); }
                        ${50 + (index * 7) % 20}% { transform: rotate(${-7 - (index % 3) * 4}deg); }
                        ${75 + (index * 3) % 15}% { transform: rotate(${4 + (index % 5) * 3}deg); }
                        100% { transform: rotate(${-5 - (index % 3) * 5}deg); }
                      `;
                      
                      // Pulsating glow effect that matches swing timing
                      const pulseGlow = keyframes`
                        0%, 100% { filter: drop-shadow(0 0 2px ${alpha(tech.color, 0.3)}); }
                        ${30 + (index * 7) % 40}% { filter: drop-shadow(0 0 8px ${alpha(tech.color, 0.8)}); }
                        ${60 + (index * 11) % 30}% { filter: drop-shadow(0 0 2px ${alpha(tech.color, 0.3)}); }
                      `;
                      
                      // Animation duration varies between 4-8 seconds
                      const animDuration = 4 + (index % 5);

                      return (
                        <Box
                          key={index}
                          sx={{
                            position: 'absolute',
                            top: 10, // connect to ceiling
                            left: `${5 + (index * 7.5)}%`, // more spacing between pendulums
                            width: 2,
                            height: heightFactor,
                            bgcolor: 'grey.400',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            transformOrigin: 'top center',
                            animation: `${swingAnimation} ${animDuration}s infinite ease-in-out`,
                            animationDelay: `${(index * 0.5) % 2.5}s`,
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              bottom: 0,
                              width: 38, 
                              height: 38,
                              borderRadius: '50%',
                              backgroundColor: alpha(tech.color, 0.2),
                              boxShadow: `0 0 0 2px ${alpha(tech.color, 0.5)}`,
                              animation: `${pulseGlow} ${animDuration}s infinite ease-in-out`,
                              animationDelay: `${(index * 0.5) % 2.5}s`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backdropFilter: 'blur(4px)',
                            }
                          }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              width: 38, 
                              height: 38,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 1
                            }}
                          >
                            <Box 
                              component="img" 
                              src={tech.logo} 
                              alt={tech.name}
                              sx={{ 
                                width: 22, 
                                height: 22,
                                animation: `${pulseGlow} ${animDuration}s infinite ease-in-out`,
                                animationDelay: `${(index * 0.5) % 2.5}s`,
                                filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.7))'
                              }}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              bottom: -25,
                              color: alpha(tech.color, 0.9),
                              fontSize: '0.65rem',
                              fontWeight: 'medium',
                              textAlign: 'center',
                              width: 60,
                              left: -24,
                              opacity: 0.9,
                              textShadow: '0 0 5px rgba(0,0,0,0.5)'
                            }}
                          >
                            {tech.name}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          bgcolor: alpha(theme.palette.background.paper, 0.5),
        }}
      >
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.7 }
            }}
            sx={{ mb: 6, textAlign: 'center' }}
          >
            <Typography
              variant="h3"
              sx={{ 
                fontWeight: 700,
                mb: 2
              }}
            >
              Complete Native App Stack
            </Typography>
            <Typography
              variant="body1"
              sx={{ 
                maxWidth: 700,
                mx: 'auto',
                color: theme.palette.text.secondary
              }}
            >
              Everything you need to build and launch your SaaS product and native mobile apps from a single codebase.
            </Typography>
          </MotionBox>

          <Grid container spacing={2}>
            {features.map((feature, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4, transition: { duration: 1.5 } }}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: { xs: 300, md: 600 },
              height: { xs: 300, md: 600 },
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              filter: 'blur(80px)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </Box>

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <MotionTypography
            variant="h3"
            sx={{ 
              fontWeight: 700,
              mb: 3
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.7 }
            }}
          >
            Build Once, Deploy Everywhere
          </MotionTypography>
          
          <MotionTypography
            variant="body1"
            sx={{ 
              mb: 4,
              fontSize: '1.1rem',
              color: theme.palette.text.secondary,
              maxWidth: 700,
              mx: 'auto'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.7, delay: 0.2 }
            }}
          >
            Launch your iOS, Android, and web apps from a single codebase. 
            Start building your cross-platform solution today with our SEO-optimized stack.
          </MotionTypography>
          
          <MotionButton
            variant="contained"
            size="large"
            onClick={() => window.location.href = '/app/login'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.7, delay: 0.4 }
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
            }}
            whileTap={{ scale: 0.95 }}
            sx={{
              borderRadius: 2,
              py: 1.5,
              px: 4,
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            }}
          >
            Sign In to See Demo App
          </MotionButton>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 4,
          bgcolor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} AppPop. All rights reserved.
              </Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={2}>
                <Button 
                  size="small" 
                  color="inherit"
                  onClick={() => window.open('https://github.com/stevengonsalvez/apppop', '_blank')}
                >
                  GitHub
                </Button>
                <Button 
                  size="small" 
                  color="inherit"
                  onClick={() => history.push('/docs/development')}
                >
                  Documentation
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}; 