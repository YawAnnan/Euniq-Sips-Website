import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQPage = () => {
  const faqCategories = [
    {
      category: 'Viva Products & Flavors',
      questions: [
        {
          question: 'What varieties of Viva drinks are available?',
          answer: 'The Viva collection features 10 distinct varieties across three categories. Nectars: Orange, Guava, Mango, Grape, and Cocktail. Juices: Apple and Pineapple. Milk Mixes: Banana, Chocolate, and Strawberry.',
        },
        {
          question: 'What are the pack specifications?',
          answer: 'All Viva drinks come in convenient 200ml individual portions. They are sold in standard packs containing exactly 27 pieces per pack.',
        },
        {
          question: 'What is the difference between Nectars and Juices?',
          answer: 'Our Juices (Apple, Pineapple) are crisp, clear, and refreshing. Our Nectars (Orange, Guava, Mango, etc.) have a richer, more velvety texture containing fruit puree for a bolder flavor profile.',
        },
        {
          question: 'Do the Milk Mixes require refrigeration before opening?',
          answer: 'Viva Milk Mixes (Banana, Chocolate, Strawberry) are shelf-stable and do not require refrigeration before opening. However, they are best served chilled for the optimal creamy experience.',
        },
      ],
    },
    {
      category: 'Pricing & Wholesale Orders',
      questions: [
        {
          question: 'What is the retail price for a pack?',
          answer: 'The standard retail price for a 27-piece pack of any Viva variety is GHS 90.',
        },
        {
          question: 'Do you offer wholesale pricing?',
          answer: 'Yes! We offer discounted wholesale pricing starting at GHS 88 per pack. Wholesale rates apply to orders of 50 packs or more, with even better prices available for larger orders: 50–199 packs: GHS 88 per pack, 200–499 packs: GHS 87 per pack,  500–999 packs: GHS 85 per pack, 1,000+ packs: GHS 83 per pack',
        },
        {
          question: 'How do I place a wholesale order?',
          answer: 'You can place wholesale orders directly through our website. Simply go to any product page, select the "Wholesale Pack" option, and choose the quantity you need. Tiered wholesale pricing is automatically applied based on your order volume, with discounts starting from 50 packs and increasing for larger orders.',
        },
        {
          question: 'Can I mix and match flavors for a wholesale order?',
          answer: 'Yes — you can mix and match flavors for wholesale orders.',
        },
      ],
    },
    {
      category: 'Shipping & Delivery',
      questions: [
        {
          question: 'How are retail orders shipped?',
          answer: 'Retail orders are shipped via standard courier services and typically arrive within 2-3 business days within major cities.',
        },
        {
          question: 'How are wholesale orders delivered?',
          answer: 'Wholesale orders are palletized and delivered via freight. Due to the volume, delivery scheduling will be coordinated directly with your receiving team after checkout. Freight times vary by location.',
        },
        {
          question: 'What happens if a pack is damaged during transit?',
          answer: 'We take great care in packaging, but if damages occur, please document it with photos on the bill of lading upon receipt and contact us within 24 hours. We will replace damaged stock promptly.',
        },
      ],
    },
    {
      category: 'Payments & Accounts',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept major credit/debit cards and mobile money options through our secure online portal for both retail and wholesale orders.',
        },
        {
          question: 'Can wholesale buyers pay via bank transfer?',
          answer: 'Yes, verified B2B partners placing large wholesale orders can opt for bank transfer. Please contact our sales team to arrange invoice-based billing.',
        },
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>FAQ - Viva Sips Collection</title>
        <meta name="description" content="Find answers about Viva drink varieties, pack sizes, retail pricing, and wholesale order requirements." />
      </Helmet>

      <div className="bg-primary text-primary-foreground py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-primary-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Everything you need to know about the Viva collection, pack sizes, and wholesale pricing.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-foreground border-b border-border pb-2">{category.category}</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((item, questionIndex) => (
                  <AccordionItem
                    key={questionIndex}
                    value={`${categoryIndex}-${questionIndex}`}
                    className="bg-card rounded-xl px-6 border border-border shadow-sm"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5">
                      <span className="font-medium text-foreground">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 bg-accent/10 border border-accent/20 rounded-2xl p-10 text-center"
        >
          <h3 className="text-2xl font-semibold mb-4 text-foreground">Need bulk order assistance?</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Our wholesale team is ready to help coordinate large freight deliveries or mixed pallets. Reach out directly.
          </p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Contact Sales Team
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default FAQPage;