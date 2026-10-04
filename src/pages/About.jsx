import styled from 'styled-components';

const StyledP = styled.p`
  margin: 2rem 10rem;
`;

function About() {
  return (
    <>
      <StyledP>
        This is an app that keeps track of all of the things you have "to do",
        and things you have already done. It is built using React for the
        front-end, and Airtable as a backend. You can add, complete, and update
        tasks as you see fit.
      </StyledP>
    </>
  );
}
export default About;
