import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import { IProperty } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';

interface SimilarPropertiesCarouselProps {
    currentProperty: IProperty;
}

export default async function SimilarPropertiesCarousel({ currentProperty }: SimilarPropertiesCarouselProps) {
    let similarProperties: IProperty[] = [];

    try {
        await connectToDatabase();
        if (mongoose.connection.readyState) {
            // Find properties in the same city or of the same type, excluding the current property
            const query = {
                _id: { $ne: currentProperty._id }, // Exclude current
                status: 'for-sale', // Only show available properties
                $or: [
                    { city: currentProperty.city },
                    { type: currentProperty.type }
                ]
            };

            const properties = await Property.find(query)
                .sort({ featured: -1, createdAt: -1 }) // Prioritize featured properties
                .limit(4)
                .lean();

            similarProperties = JSON.parse(JSON.stringify(properties));
        }
    } catch (error) {
        console.warn('Failed to fetch similar properties:', error);
    }

    if (similarProperties.length === 0) return null;

    return (
        <div className="w-full mt-24 pt-16 border-t border-slate-200">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h3 className="font-playfair text-3xl font-medium text-navy-900 mb-2">Similar Properties</h3>
                    <p className="font-outfit text-slate-500">Other luxury estates you might be interested in.</p>
                </div>
            </div>

            {/* Horizontal Scroll Snap Carousel Native CSS */}
            <div className="w-full relative pb-8">
                <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 hide-scroll">
                    {similarProperties.map((property) => (
                        <div
                            key={property._id?.toString() || property.slug}
                            className="min-w-[85vw] sm:min-w-[400px] w-full max-w-sm flex-none snap-start shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] rounded-3xl"
                        >
                            <PropertyCard property={property} />
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scroll::-webkit-scrollbar {
                    display: none;
                }
                .hide-scroll {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none;    /* Firefox */
                }
            `}} />
        </div>
    );
}
