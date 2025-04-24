'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaTelegram, FaChevronDown,
         FaHome, FaGamepad, FaGift, FaUser, FaQuestionCircle } from 'react-icons/fa';
import styles from './Footer.module.scss';

const Footer = () => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerTop}>
          <div className={styles.footerLogo}>
            <h2><span>92</span>LOTTERY</h2>
            <p>Trải nghiệm cược trực tuyến tuyệt vời nhất</p>
          </div>

          <div className={styles.footerSocial}>
            <h3>Theo dõi chúng tôi</h3>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon}><FaFacebookF /></a>
              <a href="#" className={styles.socialIcon}><FaTwitter /></a>
              <a href="#" className={styles.socialIcon}><FaInstagram /></a>
              <a href="#" className={styles.socialIcon}><FaYoutube /></a>
              <a href="#" className={styles.socialIcon}><FaTelegram /></a>
            </div>
          </div>
        </div>

        <div className={styles.footerLinks}>
          <div className={styles.footerLinksColumn}>
            <h3>Thể thao</h3>
            <ul>
              <li><Link href="/sports/football">Bóng đá</Link></li>
              <li><Link href="/sports/basketball">Bóng rổ</Link></li>
              <li><Link href="/sports/tennis">Quần vợt</Link></li>
              <li><Link href="/sports/esports">Esports</Link></li>
              <li><Link href="/sports/all">Tất cả thể thao</Link></li>
            </ul>
          </div>

          <div className={styles.footerLinksColumn}>
            <h3>Casino</h3>
            <ul>
              <li><Link href="/casino/slots">Slots</Link></li>
              <li><Link href="/casino/table-games">Game bàn</Link></li>
              <li><Link href="/casino/jackpots">Jackpots</Link></li>
              <li><Link href="/live-casino">Casino trực tuyến</Link></li>
              <li><Link href="/casino/new-games">Trò chơi mới</Link></li>
            </ul>
          </div>

          <div className={styles.footerLinksColumn}>
            <h3>Khuyến mãi</h3>
            <ul>
              <li><Link href="/promotions/welcome-bonus">Thưởng chào mừng</Link></li>
              <li><Link href="/promotions/free-bets">Cược miễn phí</Link></li>
              <li><Link href="/promotions/cashback">Hoàn tiền</Link></li>
              <li><Link href="/promotions/tournaments">Giải đấu</Link></li>
              <li><Link href="/vip">Chương trình VIP</Link></li>
            </ul>
          </div>

          <div className={styles.footerLinksColumn}>
            <h3>Trợ giúp</h3>
            <ul>
              <li><Link href="/help/faq">Câu hỏi thường gặp</Link></li>
              <li><Link href="/help/rules">Luật chơi</Link></li>
              <li><Link href="/help/responsible-gaming">Chơi game có trách nhiệm</Link></li>
              <li><Link href="/help/contact">Liên hệ</Link></li>
              <li><Link href="/help/terms">Điều khoản & Điều kiện</Link></li>
            </ul>
          </div>
        </div>

        {isMobile && (
          <div className={styles.mobileFooterLinks}>
            <div className={styles.mobileAccordion}>
              <div className={styles.accordionItem}>
                <div
                  className={`${styles.accordionHeader} ${activeAccordion === 'sports' ? styles.active : ''}`}
                  onClick={() => toggleAccordion('sports')}
                >
                  <h3>Thể thao</h3>
                  <FaChevronDown className={styles.icon} />
                </div>
                <div className={`${styles.accordionContent} ${activeAccordion === 'sports' ? styles.open : ''}`}>
                  <ul>
                    <li><Link href="/sports/football">Bóng đá</Link></li>
                    <li><Link href="/sports/basketball">Bóng rổ</Link></li>
                    <li><Link href="/sports/tennis">Quần vợt</Link></li>
                    <li><Link href="/sports/esports">Esports</Link></li>
                    <li><Link href="/sports/all">Tất cả thể thao</Link></li>
                  </ul>
                </div>
              </div>

              <div className={styles.accordionItem}>
                <div
                  className={`${styles.accordionHeader} ${activeAccordion === 'casino' ? styles.active : ''}`}
                  onClick={() => toggleAccordion('casino')}
                >
                  <h3>Casino</h3>
                  <FaChevronDown className={styles.icon} />
                </div>
                <div className={`${styles.accordionContent} ${activeAccordion === 'casino' ? styles.open : ''}`}>
                  <ul>
                    <li><Link href="/casino/slots">Slots</Link></li>
                    <li><Link href="/casino/table-games">Game bàn</Link></li>
                    <li><Link href="/casino/jackpots">Jackpots</Link></li>
                    <li><Link href="/live-casino">Casino trực tuyến</Link></li>
                    <li><Link href="/casino/new-games">Trò chơi mới</Link></li>
                  </ul>
                </div>
              </div>

              <div className={styles.accordionItem}>
                <div
                  className={`${styles.accordionHeader} ${activeAccordion === 'promotions' ? styles.active : ''}`}
                  onClick={() => toggleAccordion('promotions')}
                >
                  <h3>Khuyến mãi</h3>
                  <FaChevronDown className={styles.icon} />
                </div>
                <div className={`${styles.accordionContent} ${activeAccordion === 'promotions' ? styles.open : ''}`}>
                  <ul>
                    <li><Link href="/promotions/welcome-bonus">Thưởng chào mừng</Link></li>
                    <li><Link href="/promotions/free-bets">Cược miễn phí</Link></li>
                    <li><Link href="/promotions/cashback">Hoàn tiền</Link></li>
                    <li><Link href="/promotions/tournaments">Giải đấu</Link></li>
                    <li><Link href="/vip">Chương trình VIP</Link></li>
                  </ul>
                </div>
              </div>

              <div className={styles.accordionItem}>
                <div
                  className={`${styles.accordionHeader} ${activeAccordion === 'help' ? styles.active : ''}`}
                  onClick={() => toggleAccordion('help')}
                >
                  <h3>Trợ giúp</h3>
                  <FaChevronDown className={styles.icon} />
                </div>
                <div className={`${styles.accordionContent} ${activeAccordion === 'help' ? styles.open : ''}`}>
                  <ul>
                    <li><Link href="/help/faq">Câu hỏi thường gặp</Link></li>
                    <li><Link href="/help/rules">Luật chơi</Link></li>
                    <li><Link href="/help/responsible-gaming">Chơi game có trách nhiệm</Link></li>
                    <li><Link href="/help/contact">Liên hệ</Link></li>
                    <li><Link href="/help/terms">Điều khoản & Điều kiện</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.footerBottom}>
          <div className={styles.paymentMethods}>
            <h3>Phương thức thanh toán</h3>
            <div className={styles.paymentIcons}>
              <div className={styles.paymentIcon}>Visa</div>
              <div className={styles.paymentIcon}>Mastercard</div>
              <div className={styles.paymentIcon}>Skrill</div>
              <div className={styles.paymentIcon}>Neteller</div>
              <div className={styles.paymentIcon}>Bitcoin</div>
            </div>
          </div>

          <div className={styles.footerInfo}>
            <p>92LOTTERY được vận hành bởi 92LOTTERY Gaming Ltd, một công ty đăng ký theo luật của Malta với số đăng ký C12345.</p>
            <p>© 2023 92LOTTERY. Tất cả các quyền được bảo lưu.</p>
          </div>
        </div>
      </div>

      {isMobile && (
        <div className={styles.mobileAppBar}>
          <Link href="/" className={`${styles.mobileAppBarItem} ${styles.active}`}>
            <FaHome className={styles.icon} />
            <span className={styles.label}>Trang chủ</span>
          </Link>
          <Link href="/casino" className={styles.mobileAppBarItem}>
            <FaGamepad className={styles.icon} />
            <span className={styles.label}>Casino</span>
          </Link>
          <Link href="/promotions" className={styles.mobileAppBarItem}>
            <FaGift className={styles.icon} />
            <span className={styles.label}>Khuyến mãi</span>
          </Link>
          <Link href="/help" className={styles.mobileAppBarItem}>
            <FaQuestionCircle className={styles.icon} />
            <span className={styles.label}>Trợ giúp</span>
          </Link>
          <Link href="/account" className={styles.mobileAppBarItem}>
            <FaUser className={styles.icon} />
            <span className={styles.label}>Tài khoản</span>
          </Link>
        </div>
      )}
    </footer>
  );
};

export default Footer;
