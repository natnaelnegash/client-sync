import { nanoid } from "nanoid";
import { db } from "..";
import { projectTypes } from "../schema";


export async function seedProjectTypes() {  
    const result = await db.insert(projectTypes).values([
        {
            name: 'Branding',
            slug: `branding-${nanoid(6)}-system`
        },
        {
            name: 'Business Consulting',
            slug: `business-consulting-${nanoid(6)}-system`
        },
        {
            name: 'Copywriting',
            slug: `Copywriting-${nanoid(6)}-system`
        },
        {
            name: 'E-commerce',
            slug: `e-commerce-${nanoid(6)}-system`
        },
        {
            name: 'Mobile App Development',
            slug: `mobile-app-development-${nanoid(6)}-system`
        },
        {
            name: 'Photography',
            slug: `photography-${nanoid(6)}-system`
        },
        {
            name: 'Video Production',
            slug: `video-production-${nanoid(6)}-system`
        },
        {
            name: 'Website Development',
            slug: `website-development-${nanoid(6)}-system`
        },
        {
            name: 'Digital Marketing',
            slug: `digital-marketing-${nanoid(6)}-system`
        },
    ]).returning()

    console.log(`Inserted ${result.length} project types`);

    return result;
}
