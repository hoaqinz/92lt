'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './page.module.scss';

// Dữ liệu mẫu cho các bài viết blog
const blogPosts = [
  {
    id: 'post-1',
    title: 'Hướng dẫn cách chơi Win Go hiệu quả nhất',
    excerpt: 'Tìm hiểu các chiến thuật và mẹo chơi Win Go để tăng cơ hội chiến thắng của bạn.',
    category: 'Hướng dẫn',
    date: '15/07/2023',
    views: 1250,
    image: 'https://via.placeholder.com/1200x600/1a1a1a/ff0000?text=Win+Go+Guide',
    content: `
      <p>Win Go là một trong những trò chơi xổ số phổ biến nhất tại 92LOTTERY. Trò chơi này đơn giản nhưng hấp dẫn, với cơ hội thắng lớn nếu bạn áp dụng chiến thuật đúng đắn.</p>
      
      <h2>Luật chơi Win Go</h2>
      <p>Win Go là trò chơi dự đoán kết quả của một quả bóng sẽ rơi vào ô màu đỏ hay xanh. Mỗi phiên chơi kéo dài 1 phút, và bạn cần đặt cược trước khi phiên kết thúc.</p>
      
      <h2>Chiến thuật cơ bản</h2>
      <p>Dưới đây là một số chiến thuật cơ bản giúp bạn tăng cơ hội chiến thắng khi chơi Win Go:</p>
      
      <h3>1. Quản lý vốn thông minh</h3>
      <p>Đây là yếu tố quan trọng nhất. Hãy chia nhỏ vốn của bạn và chỉ đặt cược một phần nhỏ trong mỗi lượt chơi. Điều này giúp bạn có thể chơi lâu hơn và có cơ hội thắng lớn hơn.</p>
      
      <h3>2. Theo dõi xu hướng</h3>
      <p>Mặc dù kết quả của Win Go là ngẫu nhiên, nhưng việc theo dõi xu hướng trong 10-20 phiên gần nhất có thể giúp bạn đưa ra quyết định tốt hơn.</p>
      
      <h3>3. Sử dụng chiến thuật Martingale</h3>
      <p>Đây là chiến thuật phổ biến trong các trò chơi xổ số. Khi thua, bạn gấp đôi số tiền cược trong lần tiếp theo. Khi thắng, bạn quay lại mức cược ban đầu.</p>
      
      <h2>Lời khuyên nâng cao</h2>
      <p>Ngoài các chiến thuật cơ bản, đây là một số lời khuyên nâng cao giúp bạn chơi Win Go hiệu quả hơn:</p>
      
      <ul>
        <li>Đặt mục tiêu lợi nhuận và giới hạn thua lỗ mỗi ngày</li>
        <li>Không chơi khi cảm xúc không ổn định</li>
        <li>Luôn cập nhật và học hỏi chiến thuật mới</li>
        <li>Tham gia cộng đồng người chơi để chia sẻ kinh nghiệm</li>
      </ul>
      
      <p>Hy vọng những thông tin trên giúp bạn chơi Win Go hiệu quả hơn. Chúc bạn may mắn!</p>
    `
  },
  {
    id: 'post-2',
    title: 'Top 10 game Slots được yêu thích nhất tháng 7/2023',
    excerpt: 'Khám phá những game Slots hot nhất và được người chơi yêu thích trong tháng này.',
    category: 'Tin tức',
    date: '10/07/2023',
    views: 980,
    image: 'https://via.placeholder.com/1200x600/1a1a1a/ffcc00?text=Top+Slots',
    content: `
      <p>Slots là một trong những thể loại game casino phổ biến nhất tại 92LOTTERY. Mỗi tháng, chúng tôi đều thống kê và đánh giá những game Slots được người chơi yêu thích nhất.</p>
      
      <p>Dưới đây là danh sách Top 10 game Slots được yêu thích nhất trong tháng 7/2023:</p>
      
      <h2>1. Fortune Tiger</h2>
      <p>Fortune Tiger tiếp tục giữ vững vị trí số 1 với tỷ lệ trả thưởng cao và giao diện đẹp mắt. Game có nhiều tính năng đặc biệt như Free Spins và Multipliers.</p>
      
      <h2>2. Sweet Bonanza</h2>
      <p>Sweet Bonanza của Pragmatic Play là một game slots theo chủ đề kẹo ngọt với cơ chế Tumble và tính năng Free Spins hấp dẫn.</p>
      
      <h2>3. Gates of Olympus</h2>
      <p>Cũng đến từ Pragmatic Play, Gates of Olympus mang đến trải nghiệm slots theo chủ đề thần thoại Hy Lạp với cơ hội thắng lớn.</p>
      
      <h2>4. Mahjong Ways 2</h2>
      <p>Game slots theo chủ đề Mahjong này có 2,000 cách để thắng và nhiều tính năng đặc biệt.</p>
      
      <h2>5. 5 Lions Megaways</h2>
      <p>Với cơ chế Megaways, game này cung cấp đến 117,649 cách để thắng trong mỗi lượt quay.</p>
      
      <h2>6. Buffalo King</h2>
      <p>Game slots theo chủ đề động vật hoang dã với 4,096 cách để thắng.</p>
      
      <h2>7. Fruit Party</h2>
      <p>Game slots theo chủ đề trái cây với cơ chế Cluster Pays và Multipliers lên đến x256.</p>
      
      <h2>8. The Dog House</h2>
      <p>Game slots theo chủ đề thú cưng với 20 paylines và tính năng Sticky Wilds trong Free Spins.</p>
      
      <h2>9. Aztec Gems</h2>
      <p>Game slots đơn giản nhưng hấp dẫn với 3 reels và tính năng Money Respin.</p>
      
      <h2>10. Wolf Gold</h2>
      <p>Game slots theo chủ đề sói với tính năng Money Respin và 3 jackpots.</p>
      
      <p>Hãy thử sức với những game slots hấp dẫn này tại 92LOTTERY và có cơ hội nhận những phần thưởng lớn!</p>
    `
  },
  {
    id: 'post-3',
    title: 'Cách quản lý vốn hiệu quả khi chơi Casino trực tuyến',
    excerpt: 'Những bí quyết giúp bạn quản lý vốn một cách thông minh và hiệu quả khi chơi Casino.',
    category: 'Mẹo hay',
    date: '05/07/2023',
    views: 820,
    image: 'https://via.placeholder.com/1200x600/1a1a1a/00ff00?text=Money+Management',
    content: `
      <p>Quản lý vốn là một trong những kỹ năng quan trọng nhất khi chơi casino trực tuyến. Dù bạn là người chơi mới hay đã có kinh nghiệm, việc quản lý vốn hiệu quả sẽ giúp bạn tận hưởng trò chơi lâu hơn và tăng cơ hội thắng lợi.</p>
      
      <h2>Tại sao quản lý vốn lại quan trọng?</h2>
      <p>Quản lý vốn giúp bạn:</p>
      <ul>
        <li>Kiểm soát được số tiền đặt cược</li>
        <li>Tránh thua lỗ quá nhiều</li>
        <li>Chơi lâu hơn với số vốn có hạn</li>
        <li>Tăng cơ hội thắng lợi trong dài hạn</li>
      </ul>
      
      <h2>Các chiến thuật quản lý vốn hiệu quả</h2>
      
      <h3>1. Quy tắc 5%</h3>
      <p>Đây là quy tắc đơn giản nhưng hiệu quả: không bao giờ đặt cược quá 5% tổng vốn của bạn trong một lượt chơi. Ví dụ, nếu bạn có 1,000,000 VND, thì mỗi lượt chơi chỉ nên đặt tối đa 50,000 VND.</p>
      
      <h3>2. Phương pháp Kelly Criterion</h3>
      <p>Đây là phương pháp toán học giúp xác định số tiền tối ưu để đặt cược dựa trên xác suất thắng và tỷ lệ cược. Công thức: f* = (bp - q) / b, trong đó:</p>
      <ul>
        <li>f* là phần trăm vốn nên đặt cược</li>
        <li>b là tỷ lệ cược (số tiền thắng trên mỗi đơn vị đặt cược)</li>
        <li>p là xác suất thắng</li>
        <li>q là xác suất thua (1 - p)</li>
      </ul>
      
      <h3>3. Phương pháp Martingale</h3>
      <p>Phương pháp này yêu cầu bạn gấp đôi số tiền cược sau mỗi lần thua, và quay lại mức cược ban đầu khi thắng. Tuy nhiên, phương pháp này khá rủi ro và cần vốn lớn.</p>
      
      <h3>4. Phương pháp D'Alembert</h3>
      <p>Đây là phiên bản an toàn hơn của Martingale. Thay vì gấp đôi, bạn chỉ tăng một đơn vị sau mỗi lần thua và giảm một đơn vị sau mỗi lần thắng.</p>
      
      <h2>Lời khuyên thực tế</h2>
      
      <h3>Thiết lập giới hạn</h3>
      <p>Trước khi bắt đầu chơi, hãy thiết lập:</p>
      <ul>
        <li>Giới hạn thua: Số tiền tối đa bạn chấp nhận thua trong một phiên chơi</li>
        <li>Giới hạn thắng: Số tiền khi đạt được, bạn sẽ dừng chơi và rút tiền</li>
      </ul>
      
      <h3>Tách biệt vốn chơi</h3>
      <p>Luôn tách biệt vốn chơi casino với tiền sinh hoạt. Chỉ chơi với số tiền bạn có thể chấp nhận mất.</p>
      
      <h3>Không đuổi theo thua lỗ</h3>
      <p>Đây là sai lầm phổ biến nhất. Khi thua, nhiều người có xu hướng đặt cược nhiều hơn để "gỡ lại". Điều này thường dẫn đến thua lỗ lớn hơn.</p>
      
      <p>Hy vọng những thông tin trên giúp bạn quản lý vốn hiệu quả hơn khi chơi casino trực tuyến tại 92LOTTERY. Chúc bạn may mắn!</p>
    `
  },
  {
    id: 'post-4',
    title: 'Những sai lầm phổ biến khi chơi Bắn Cá và cách tránh',
    excerpt: 'Tránh những sai lầm này để nâng cao kỹ năng và tăng cơ hội chiến thắng khi chơi Bắn Cá.',
    category: 'Mẹo hay',
    date: '01/07/2023',
    views: 750,
    image: 'https://via.placeholder.com/1200x600/1a1a1a/00ccff?text=Fishing+Tips',
    content: `
      <p>Bắn Cá là một trong những trò chơi phổ biến nhất tại 92LOTTERY. Tuy nhiên, nhiều người chơi thường mắc phải những sai lầm cơ bản khiến họ thua lỗ không đáng có. Bài viết này sẽ giúp bạn nhận diện và tránh những sai lầm phổ biến khi chơi Bắn Cá.</p>
      
      <h2>Sai lầm #1: Không hiểu rõ luật chơi</h2>
      <p>Nhiều người chơi bắt đầu chơi Bắn Cá mà không hiểu rõ luật chơi, giá trị của từng loại cá, và cách tính điểm. Điều này khiến họ không thể đưa ra quyết định đúng đắn trong quá trình chơi.</p>
      
      <h3>Cách khắc phục:</h3>
      <p>Dành thời gian đọc hướng dẫn và chơi ở chế độ demo trước khi bắt đầu chơi thật. Hiểu rõ giá trị của từng loại cá và các tính năng đặc biệt trong game.</p>
      
      <h2>Sai lầm #2: Bắn tất cả các loại cá</h2>
      <p>Một sai lầm phổ biến khác là bắn tất cả các loại cá xuất hiện trên màn hình. Điều này không chỉ lãng phí đạn mà còn khiến bạn bỏ lỡ cơ hội bắn những con cá có giá trị cao hơn.</p>
      
      <h3>Cách khắc phục:</h3>
      <p>Tập trung bắn những con cá có giá trị cao và dễ bắn. Đừng lãng phí đạn vào những con cá nhỏ hoặc di chuyển quá nhanh.</p>
      
      <h2>Sai lầm #3: Không quản lý vốn</h2>
      <p>Nhiều người chơi không có kế hoạch quản lý vốn khi chơi Bắn Cá. Họ đặt cược quá cao hoặc tiếp tục chơi khi đã thua nhiều.</p>
      
      <h3>Cách khắc phục:</h3>
      <p>Thiết lập giới hạn thua và thắng trước khi bắt đầu chơi. Chỉ chơi với số tiền bạn có thể chấp nhận mất và không đuổi theo thua lỗ.</p>
      
      <h2>Sai lầm #4: Không sử dụng kỹ năng đặc biệt</h2>
      <p>Trong hầu hết các game Bắn Cá, có các kỹ năng đặc biệt như đóng băng, bom, laser... Nhiều người chơi không sử dụng hoặc sử dụng không đúng lúc các kỹ năng này.</p>
      
      <h3>Cách khắc phục:</h3>
      <p>Hiểu rõ từng kỹ năng đặc biệt và thời điểm tốt nhất để sử dụng chúng. Ví dụ, sử dụng đóng băng khi có nhiều cá lớn xuất hiện cùng lúc.</p>
      
      <h2>Sai lầm #5: Chơi quá lâu</h2>
      <p>Chơi quá lâu không chỉ khiến bạn mệt mỏi mà còn dễ dẫn đến quyết định sai lầm do mất tập trung.</p>
      
      <h3>Cách khắc phục:</h3>
      <p>Đặt giới hạn thời gian chơi và nghỉ ngơi định kỳ. Điều này giúp bạn duy trì sự tập trung và đưa ra quyết định tốt hơn.</p>
      
      <h2>Sai lầm #6: Không học hỏi từ người khác</h2>
      <p>Nhiều người chơi không quan sát và học hỏi từ những người chơi giỏi hơn.</p>
      
      <h3>Cách khắc phục:</h3>
      <p>Xem các video hướng dẫn, tham gia diễn đàn và học hỏi từ những người chơi có kinh nghiệm. Điều này sẽ giúp bạn nâng cao kỹ năng nhanh chóng.</p>
      
      <p>Hy vọng những thông tin trên giúp bạn tránh được những sai lầm phổ biến khi chơi Bắn Cá tại 92LOTTERY. Chúc bạn may mắn và có những trải nghiệm chơi game tuyệt vời!</p>
    `
  }
];

export default function BlogPostPage() {
  const params = useParams();
  const postId = params.id as string;
  
  // Tìm bài viết theo ID
  const post = blogPosts.find(post => post.id === postId);
  
  // Nếu không tìm thấy bài viết
  if (!post) {
    return (
      <div className={styles.errorContainer}>
        <h1>Không tìm thấy bài viết</h1>
        <p>Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link href="/blog" className={styles.backButton}>
          Quay lại trang Blog
        </Link>
      </div>
    );
  }
  
  return (
    <div className={styles.postPage}>
      <div className={styles.postHeader}>
        <Link href="/blog" className={styles.backLink}>
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path>
          </svg> Quay lại Blog
        </Link>
        <div className={styles.postCategory}>{post.category}</div>
        <h1 className={styles.postTitle}>{post.title}</h1>
        <div className={styles.postMeta}>
          <span className={styles.postDate}>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm320-196c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM192 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM64 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"></path>
            </svg> {post.date}
          </span>
          <span className={styles.postViews}>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"></path>
            </svg> {post.views} lượt xem
          </span>
        </div>
      </div>
      
      <div className={styles.postImageContainer}>
        <img src={post.image} alt={post.title} className={styles.postImage} />
      </div>
      
      <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.content }} />
      
      <div className={styles.postFooter}>
        <h3>Bài viết liên quan</h3>
        <div className={styles.relatedPosts}>
          {blogPosts
            .filter(relatedPost => relatedPost.id !== post.id)
            .slice(0, 3)
            .map(relatedPost => (
              <div key={relatedPost.id} className={styles.relatedPost}>
                <Link href={`/blog/${relatedPost.id}`}>
                  <img src={relatedPost.image} alt={relatedPost.title} />
                  <h4>{relatedPost.title}</h4>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
