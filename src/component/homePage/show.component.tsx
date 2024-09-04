import React from 'react';
import '../assets/css/aquarium_css/show.css';

interface TestimonialProps {
    image: string;
    quote: string;
    name: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ image, quote, name }) => {
    return (
        <div className="testimonial-item">
            <img src={image} alt={name} className="testimonial-image" />
            <p className="testimonial-quote">"{quote}"</p>
            <p className="testimonial-name">{name}</p>
        </div>
    );
};

const testimonials = [
    {
        image: require("../assets/img/aquarium/ab_2.jpg"),
        quote: 'Lorem ipsum dolor sit amet, consectetur adip iscing elit.',
        name: 'Rita Eland'
    },
    {
        image: require("../assets/img/aquarium/ab_2.jpg"),
        quote: 'Lorem ipsum dolor sit amet, consectetur adip iscing elit.',
        name: 'Cheryl Butler'
    },
    {
        image: require("../assets/img/aquarium/ab_2.jpg"),
        quote: 'Lorem ipsum dolor sit amet, consectetur adip iscing elit.',
        name: 'Kayla Wheatly'
    },
    {
        image: require("../assets/img/aquarium/ab_2.jpg"),
        quote: 'Lorem ipsum dolor sit amet, consectetur adip iscing elit.',
        name: 'Ted Ortega'
    },
    {
        image: require("../assets/img/aquarium/ab_2.jpg"),
        quote: 'Lorem ipsum dolor sit amet, consectetur adip iscing elit.',
        name: 'Glen Bennett'
    },
    {
        image: require("../assets/img/aquarium/ab_2.jpg"),
        quote: 'Lorem ipsum dolor sit amet, consectetur adip iscing elit.',
        name: 'Unity Norris'
    },
    {
        image: require("../assets/img/aquarium/ab_2.jpg"),
        quote: 'Lorem ipsum dolor sit amet, consectetur adip iscing elit.',
        name: 'Glen Bennett'
    },
    {
        image: require("../assets/img/aquarium/ab_2.jpg"),
        quote: 'Lorem ipsum dolor sit amet, consectetur adip iscing elit.',
        name: 'Unity Norris'
    }
];

const Testimonials: React.FC = () => {
    return (
        <section className="testimonials">
            <h3 className="section-subtitle">Testimonial</h3>
            <h2 className="section-title">Some Quotes From Our Clients</h2>
            <p className="section-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam dolore aliqua.
            </p>
            <div className="testimonials-grid">
                {testimonials.map((testimonial, index) => (
                    <Testimonial
                        key={index}
                        image={testimonial.image}
                        quote={testimonial.quote}
                        name={testimonial.name}
                    />
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
