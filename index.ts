/**
 * TYPE DEFINITIONS
 * This file contains all TypeScript types used throughout the application
 * Types help catch errors early and make code more maintainable
 */

// User role types - defines what kind of user someone is
export type UserRole = "student" | "developer" | "social-media-manager" | "normal-user";

// User interface - defines the structure of a user object
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: Date;
}

// Course interface - defines the structure of a course
export interface Course {
    id: string;
    title: string;
    description: string;
    instructor: string;
    thumbnail: string;
    modules: Module[];
    // Role-based access: which roles can access this course
    allowedRoles: UserRole[];
}

// Module interface - a course is made up of multiple modules
export interface Module {
    id: string;
    title: string;
    description: string;
    order: number; // Order in which modules appear
    classes: Class[];
}

// Class interface - each module contains multiple classes
export interface Class {
    id: string;
    title: string;
    description: string;
    videoUrl: string; // URL to the video recording
    duration: number; // Duration in minutes
    topics: string[]; // List of topics covered
    order: number;
}
