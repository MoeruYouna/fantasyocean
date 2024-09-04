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
      <div className="wrapper">
        <div className="section section-about-us">
          <Container>
            <Row>
              <Col className="ml-auto mr-auto text-center" md="8">
                <h2 className="title">Who we are?</h2>
                <h5 className="description">
                Tại Dolphin-Shop, chúng tôi là những người đam mê cá cảnh, mang đến cho bạn thế giới hấp dẫn của hồ cá. Chúng tôi cung cấp đa dạng loài cá đẹp mắt, hồ cá thiết kế tỉ mỉ và phụ kiện chất lượng. Với đội ngũ giàu kinh nghiệm, chúng tôi cam kết mang đến sự tư vấn chuyên nghiệp và dịch vụ hỗ trợ tận tâm. Hãy để Dolphin-Shop cùng bạn biến ngôi nhà thành không gian sống tươi mới và bình yên với thế giới cá cảnh độc đáo của chúng tôi.
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
                    Bạn đã sẵn sàng bước vào thế giới mê hoặc của cá cảnh tại Dolphin-Shop ?
                  </h3>
                  <p>
                  Tại đây, chúng tôi không chỉ cung cấp những loài cá cảnh đẹp mắt mà còn mang đến cho bạn những hồ cá được thiết kế tinh tế và các phụ kiện thủy sinh chất lượng cao. Mỗi sản phẩm tại Dolphin-Shop đều được chọn lựa kỹ lưỡng để giúp bạn tạo nên một không gian thủy sinh hoàn hảo, đem lại sự bình yên và thư giãn cho ngôi nhà của bạn.
                  </p>
                  <p>
                  Chúng tôi tự hào là điểm đến lý tưởng cho những người yêu thích cá cảnh, từ người mới bắt đầu đến những người chơi chuyên nghiệp. Hãy đến với Dolphin-Shop để khám phá và tận hưởng vẻ đẹp của thiên nhiên, biến giấc mơ về một hồ cá rực rỡ và yên bình trở thành hiện thực!
                  </p>
                  <p>
                    
Tại Dolphin-Shop, chúng tôi hiểu rằng mỗi hồ cá không chỉ là một sản phẩm mà còn là một tác phẩm nghệ thuật và niềm đam mê của bạn. Chúng tôi cam kết mang đến cho bạn trải nghiệm mua sắm thú vị và hài lòng, với dịch vụ chăm sóc khách hàng tận tâm và chế độ bảo hành uy tín. Hãy để Dolphin-Shop cùng bạn kiến tạo không gian sống tươi mới và sinh động, nơi bạn có thể thả mình vào thế giới bình yên của những chú cá cảnh tuyệt vời.
                  </p>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
}

export default AboutPage;
