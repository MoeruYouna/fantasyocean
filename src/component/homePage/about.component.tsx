import React from "react";

// reactstrap components
import {
  Container,
  Row,
  Col
} from "reactstrap";

// core components

function AboutPage() {
  React.useEffect(() => {
    document.body.classList.add("landing-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("landing-page");
      document.body.classList.remove("sidebar-collapse");
    };
  }, []);
  return (
    <>
        <div className="section section-about-us">
          <Container>
            <Row>
              <Col className="ml-auto mr-auto text-center" md="8">
                <h2 className="title">Who we are?</h2>
                <h5 className="description">
                Chào mừng bạn đến với Fantasy-Ocean – nơi mà đam mê cá cảnh của bạn sẽ được thăng hoa trong một thế giới kỳ diệu dưới đại dương! Tại đây, chúng mình mang đến vô số loài cá độc đáo, những bể cá được thiết kế tỉ mỉ, và hàng loạt phụ kiện xịn sò để bạn tự do sáng tạo không gian sống của mình.
                Đội ngũ của Fantasy-Ocean không chỉ giàu kinh nghiệm mà còn cực kỳ nhiệt huyết, luôn sẵn sàng tư vấn và hỗ trợ bạn mọi lúc. Hãy để chúng mình đồng hành cùng bạn, biến căn nhà thành một đại dương thu nhỏ, đầy sắc màu và thư giãn. Fantasy-Ocean – nơi mỗi góc nhỏ đều dẫn lối vào thế giới cá cảnh mơ mộng, đưa bạn lạc vào một không gian tươi mới, bình yên nhưng không kém phần phiêu lưu!
                </h5>
              </Col>
            </Row>
            <div className="separator separator-primary"></div>
            <div className="section-story-overview">
              <Row>
                <Col md="6">
                  <div
                    className="image-container image-left"
                    style={{
                      backgroundImage:
                        "url(" + require("../assets/img/aquarium/ab_1.jpg") + ")"
                    }}
                  >
                    <p className="blockquote blockquote-info">
                      "Nuôi cá cảnh không chỉ là một sở thích, mà còn là nghệ thuật biến tấu thiên nhiên trong tầm tay, mang lại sự bình yên và niềm vui cho cuộc sống hàng ngày." <br></br>
                      <br></br>
                      <small>-Takashi Amano</small>
                    </p>
                  </div>
                  <div
                    className="image-container"
                    style={{
                      backgroundImage:
                        "url(" + require("../assets/img/aquarium/ab_2.jpg") + ")"
                    }}
                  ></div>
                </Col>
                <Col md="5">
                  <div
                    className="image-container image-right"
                    style={{
                      backgroundImage:
                        "url(" + require("../assets/img/aquarium/ab_3.jpg") + ")"
                    }}
                  ></div>
                  <h3>
                    Bạn đã sẵn sàng bước vào thế giới mê hoặc của cá cảnh tại Fantasy-Ocean ?
                  </h3>
                  <p>
                  Tại **Fantasy-Ocean**, chúng mình không chỉ mang đến những loài cá cảnh tuyệt đẹp mà còn cung cấp các bể cá được thiết kế tinh tế cùng phụ kiện thủy sinh chất lượng cao. Mỗi sản phẩm tại đây đều được lựa chọn kỹ lưỡng, giúp bạn dễ dàng tạo nên một không gian thủy sinh hoàn hảo, mang lại sự bình yên và thư giãn cho ngôi nhà. Fantasy-Ocean chính là điểm đến lý tưởng để bạn khám phá và thỏa mãn đam mê với thế giới đại dương sống động!
                  </p>
                  <p>
                  chúng mình tự hào là điểm đến lý tưởng cho mọi tín đồ yêu cá cảnh, từ những người mới khám phá đến dân chơi chuyên nghiệp. Đến đây, bạn sẽ được hòa mình vào thế giới kỳ diệu của đại dương, biến giấc mơ sở hữu một bể cá lung linh và yên bình thành hiện thực. Hãy cùng Fantasy-Ocean khám phá và tận hưởng vẻ đẹp sống động từ thiên nhiên!
                  </p>
                  <p>
                  Với cam kết mang đến trải nghiệm mua sắm thú vị và dịch vụ tận tâm, Fantasy-Ocean sẽ luôn đồng hành cùng bạn trong hành trình kiến tạo không gian sống tươi mới, đầy sức sống. Hãy thả mình vào thế giới bình yên của những chú cá cảnh tuyệt vời cùng Fantasy-Ocean!
                  </p>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
    </>
  );
}

export default AboutPage;
