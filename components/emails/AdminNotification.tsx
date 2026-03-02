import * as React from 'react';
import { Html, Head, Body, Container, Section, Text } from '@react-email/components';

interface AdminNotificationProps {
    name: string;
    email: string;
    phone: string;
    message: string;
    propertyTitle: string;
}

export const AdminNotification: React.FC<Readonly<AdminNotificationProps>> = ({
    name,
    email,
    phone,
    message,
    propertyTitle,
}) => (
    <Html>
        <Head />
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Text style={logo}>🚨 New Lead Captured</Text>
                </Section>
                <Section style={content}>
                    <Text style={heading}>Inquiry for {propertyTitle}</Text>

                    <Section style={details}>
                        <Text style={dataRow}><strong>Name:</strong> {name}</Text>
                        <Text style={dataRow}><strong>Email:</strong> {email}</Text>
                        <Text style={dataRow}><strong>Phone:</strong> {phone}</Text>
                    </Section>

                    <Text style={subheading}>Message Segment:</Text>
                    <Section style={messageBox}>
                        <Text style={messageText}>{message}</Text>
                    </Section>

                    <Text style={paragraph}>
                        Log into the LASS Realty Admin Dashboard to update the status of this lead.
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
    padding: '24px 32px',
    backgroundColor: '#ef4444', // Red-500 equivalent for alert
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
};

const logo = {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: 'bold',
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
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#0f172a',
    margin: '0 0 24px 0',
    borderBottom: '2px solid #f1f5f9',
    paddingBottom: '12px',
};

const subheading = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    margin: '24px 0 8px 0',
};

const details = {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '6px',
    marginBottom: '24px',
};

const dataRow = {
    fontSize: '16px',
    color: '#334155',
    margin: '0 0 8px 0',
};

const messageBox = {
    backgroundColor: '#f1f5f9',
    padding: '16px',
    borderRadius: '6px',
    borderLeft: '4px solid #cbd5e1',
    marginBottom: '24px',
};

const messageText = {
    fontSize: '15px',
    lineHeight: '24px',
    color: '#334155',
    margin: '0',
    fontStyle: 'italic',
};

const paragraph = {
    fontSize: '14px',
    color: '#64748b',
    margin: '0',
    textAlign: 'center' as const,
};
