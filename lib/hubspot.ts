export async function syncLeadToHubspot(leadData: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
    propertySlug?: string;
    source?: string;
}) {
    const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN;

    // Fail gracefully if no token is configured
    if (!hubspotToken) {
        console.warn('HUBSPOT_ACCESS_TOKEN is not defined. Lead was not synced to HubSpot.');
        return null;
    }

    // Split name into first and last name for HubSpot
    const nameParts = leadData.name.trim().split(' ');
    const firstname = nameParts[0] || '';
    const lastname = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    const payload = {
        properties: {
            firstname: firstname,
            lastname: lastname,
            email: leadData.email,
            phone: leadData.phone || '',
            message: leadData.message || '',
            website: leadData.propertySlug ? `https://lasspuntacana.com/properties/${leadData.propertySlug}` : '',
            hs_lead_status: 'NEW',
            lifecyclestage: 'lead'
        }
    };

    try {
        const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${hubspotToken}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // If contact already exists (409 Conflict), HubSpot requires an Update call instead.
            // For now, we just log the clash so we don't crash the main API route.
            const errorBody = await response.text();
            console.error(`HubSpot sync failed: [${response.status}] ${errorBody}`);
            return null;
        }

        const data = await response.json();
        console.log(`Successfully synced lead to HubSpot. Contact ID: ${data.id}`);
        return data;

    } catch (error) {
        console.error('Network error during HubSpot sync:', error);
        return null;
    }
}
