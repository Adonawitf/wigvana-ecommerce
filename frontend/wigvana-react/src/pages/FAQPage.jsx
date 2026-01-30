import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQPage = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Browse our products, add items to your cart, and proceed to checkout. You can pay using various payment methods including mobile money and bank transfers.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept mobile money (M-Pesa, Telebirr), bank transfers, and cash on delivery in select areas. All payments are processed securely.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days within Addis Ababa and 5-7 business days for other cities in Ethiopia. Express shipping options are available.',
    },
    {
      question: 'Can I return or exchange a product?',
      answer: 'Yes, you can return or exchange products within 7 days of delivery. Products must be unused and in original packaging. See our Returns page for more details.',
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order status in your account dashboard.',
    },
    {
      question: 'Are the wigs authentic?',
      answer: 'Yes, all our sellers are verified and we ensure product authenticity. We have a strict quality control process to maintain high standards.',
    },
    {
      question: 'How do I become a seller?',
      answer: 'Click on "Become a Seller" in the navigation menu, fill out the application form, and submit required documents. Our team will review your application within 2-3 business days.',
    },
    {
      question: 'What if I receive a damaged product?',
      answer: 'Contact us immediately with photos of the damaged product. We will arrange for a replacement or full refund within 24 hours.',
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we only ship within Ethiopia. We are working on expanding our shipping services to other countries.',
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can reach us through our Contact page, email at support@wigvana.com, or call us at +251 911 123 456. Our support team is available Monday-Saturday, 9 AM - 6 PM.',
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ color: '#67442E', mb: 2 }}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Find answers to common questions about WigVana
        </Typography>
      </Box>

      <Paper elevation={0}>
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{
              mb: 1,
              '&:before': { display: 'none' },
              boxShadow: 'none',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#67442E' }} />}
              sx={{
                '&:hover': { backgroundColor: '#FBF7F4' },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Still have questions?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Contact our support team at{' '}
          <Typography
            component="span"
            sx={{ color: '#67442E', fontWeight: 500 }}
          >
            support@wigvana.com
          </Typography>
        </Typography>
      </Box>
    </Container>
  );
};

export default FAQPage;
