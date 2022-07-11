import { AnnotationIcon, ChatIcon, VideoCameraIcon, PresentationChartBarIcon } from '@heroicons/react/outline';
import Navigation from '../Navigation/Navigation';

const features =   [
    {
        name: 'Classroom',
        description:
        'Create announcements, stories and events to keep everyone updated on everything going on in the classroom. Create student portfolios and reward students with stickers, enabling parents to track the progress of their child.',
        icon: PresentationChartBarIcon,
    },
    {
        name: 'Messaging',
        description:
        'Write direct messages and create group chats. Effective communication between parents and teachers made easy.',
        icon: ChatIcon,
    },
    {
        name: 'Video Chat',
        description:
        "In-build video chat enabling real-time communication between parties. Sometimes text messaging isn't the best method of communication, especially when talking about delicate situations.",
        icon: VideoCameraIcon,
    },
    {
        name: 'SMS and Email Notifications',
        description:
        'Receive notifications through your preferred mode of communication. We support both SMS and Email notifications with customizable settings to suit your needs.',
        icon: AnnotationIcon,
    },
]

const Features = () => {
    return (
    <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
            <Navigation />
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Communication</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    Communication made easy
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                    Connecting teachers and parents, enabling relationship building between family and school to strengthen student development.
                    </p>
                </div>
        
                <div className="mt-10">
                    <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                    {features.map((feature) => (
                        <div key={feature.name} className="relative">
                        <dt>
                            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                            <feature.icon className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                        </dt>
                        <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                        </div>
                    ))}
                    </dl>
                </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Features;