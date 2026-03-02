import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Img } from '@react-email/components';

interface LeadAutoReplyProps {
    name: string;
    propertyTitle: string;
}

export const LeadAutoReply: React.FC<Readonly<LeadAutoReplyProps>> = ({
    name,
    propertyTitle,
}) => (
    <Html>
        <Head />
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Text style={logo}>LASS Realty</Text>
                </Section>
                <Section style={content}>
                    <Text style={heading}>We received your inquiry.</Text>
                    <Text style={paragraph}>Hello {name},</Text>
                    <Text style={paragraph}>
                        Thank you for reaching out regarding <strong>{propertyTitle}</strong>.
                        Our team of luxury real estate specialists has received your message and will be in touch shortly to assist you.
                    </Text>
                    <Text style={paragraph}>
                        If you need immediate assistance, please feel free to message us directly on WhatsApp at +1 (829) 523-0782.
                    </Text>
                    <Text style={paragraph}>
                        Best regards,<br />
                        The LASS Realty Team
                    </Text>
                </Section>
                <Section style={footer}>
                    <Text style={footerText}>
                        LASS Realty | Punta Cana, Dominican Republic <br />
                        info@lassrealty.com
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

const main = {
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '580px',
};

const header = {
    padding: '32px',
    backgroundColor: '#0f172a',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
};

const logo = {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: '-0.5px',
    margin: '0',
};

const content = {
    padding: '40px',
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    border: '1px solid #e2e8f0',
    borderTop: 'none',
};

const heading = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0f172a',
    margin: '0 0 20px 0',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#334155',
    margin: '0 0 20px 0',
};

const footer = {
    padding: '24px',
    textAlign: 'center' as const,
};

const footerText = {
    fontSize: '12px',
    color: '#64748b',
    margin: '0',
};
