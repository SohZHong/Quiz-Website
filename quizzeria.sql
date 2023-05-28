-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 23, 2023 at 02:04 PM
-- Server version: 8.0.27
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quizzeria`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `admin_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Admin',
  `admin_phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `admin_age` int DEFAULT NULL,
  `admin_workplace` varchar(255) DEFAULT NULL,
  `admin_email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `admin_name`, `admin_phone`, `admin_age`, `admin_workplace`, `admin_email`) VALUES
(1, 'willsmith213', '012-1234567', NULL, NULL, NULL),
(2, 'smithsmith1', '011-12345678', NULL, NULL, NULL),
(3, 'abuabu', '012-7839978', NULL, NULL, NULL),
(4, 'Admin', '', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `chapter`
--

DROP TABLE IF EXISTS `chapter`;
CREATE TABLE IF NOT EXISTS `chapter` (
  `chapter_id` int NOT NULL AUTO_INCREMENT,
  `class_id` int NOT NULL,
  `chapter_title` varchar(50) DEFAULT NULL,
  `chapter_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`chapter_id`),
  KEY `class_id` (`class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chapter`
--

INSERT INTO `chapter` (`chapter_id`, `class_id`, `chapter_title`, `chapter_description`) VALUES
(1, 1, 'Chapter 1', 'Learn Past Tense with Terry'),
(2, 1, 'Chapter 2', 'Learn Past Tense with Terry'),
(3, 1, 'Chapter 3 - Learning C++', 'Learning C++ with Wong Jun Shen');

-- --------------------------------------------------------

--
-- Table structure for table `chapter_progress`
--

DROP TABLE IF EXISTS `chapter_progress`;
CREATE TABLE IF NOT EXISTS `chapter_progress` (
  `student_id` int NOT NULL,
  `chapter_id` int NOT NULL,
  PRIMARY KEY (`student_id`,`chapter_id`),
  KEY `chapter_id` (`chapter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chapter_progress`
--

INSERT INTO `chapter_progress` (`student_id`, `chapter_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(1, 2),
(2, 2),
(1, 3),
(3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
CREATE TABLE IF NOT EXISTS `class` (
  `class_id` int NOT NULL AUTO_INCREMENT,
  `teacher_id` int NOT NULL,
  `class_name` varchar(50) NOT NULL,
  `class_description` varchar(255) DEFAULT NULL,
  `class_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`class_id`),
  KEY `teacher_id` (`teacher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `class`
--

INSERT INTO `class` (`class_id`, `teacher_id`, `class_name`, `class_description`, `class_code`, `date_created`) VALUES
(1, 1, 'Hello Hello World', 'IDK', 'yJKjUL87', '2023-04-02 11:32:41'),
(2, 1, 'Hello World', 'asdadad', 'hKquI3Jm', '2023-04-23 11:32:41'),
(6, 6, 'Chemistry Class', 'Chemistry is Fun!', 'AfcBDdq1', '2023-05-18 09:13:13'),
(7, 1, 'Physics 101', 'Learn Physics with Mr. Ong', '9a7DLQh0', '2023-05-22 22:32:41');

-- --------------------------------------------------------

--
-- Table structure for table `class_upload`
--

DROP TABLE IF EXISTS `class_upload`;
CREATE TABLE IF NOT EXISTS `class_upload` (
  `upload_id` int NOT NULL AUTO_INCREMENT,
  `class_id` int NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_size` varchar(50) NOT NULL,
  `upload_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`upload_id`),
  KEY `class_id` (`class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `class_upload`
--

INSERT INTO `class_upload` (`upload_id`, `class_id`, `file_name`, `file_size`, `upload_date`) VALUES
(1, 1, 'Hello World.txt', '0.0 KB', '2023-05-06 16:02:35'),
(2, 1, 'Tutorial Notes.txt', '0.0 KB', '2023-05-12 14:32:31');

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

DROP TABLE IF EXISTS `enrollment`;
CREATE TABLE IF NOT EXISTS `enrollment` (
  `student_id` int NOT NULL,
  `class_id` int NOT NULL,
  `date_enrolled` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`,`class_id`),
  KEY `class_id` (`class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollment`
--

INSERT INTO `enrollment` (`student_id`, `class_id`, `date_enrolled`) VALUES
(1, 1, '2023-04-23 11:46:16'),
(1, 2, '2023-05-01 22:42:34'),
(2, 1, '2023-04-24 14:06:09'),
(2, 2, '2023-05-04 10:37:19'),
(3, 1, '2023-04-24 14:06:01');

-- --------------------------------------------------------

--
-- Table structure for table `exam`
--

DROP TABLE IF EXISTS `exam`;
CREATE TABLE IF NOT EXISTS `exam` (
  `exam_id` int NOT NULL AUTO_INCREMENT,
  `class_id` int NOT NULL,
  `date_posted` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`exam_id`),
  KEY `class_id` (`class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exam`
--

INSERT INTO `exam` (`exam_id`, `class_id`, `date_posted`) VALUES
(1, 1, '2023-04-30 23:15:22');

-- --------------------------------------------------------

--
-- Table structure for table `exam_question`
--

DROP TABLE IF EXISTS `exam_question`;
CREATE TABLE IF NOT EXISTS `exam_question` (
  `question_id` int NOT NULL AUTO_INCREMENT,
  `exam_id` int NOT NULL,
  `exam_question` varchar(255) NOT NULL,
  `question_answer` varchar(50) NOT NULL,
  `question_option1` varchar(50) NOT NULL,
  `question_option2` varchar(50) NOT NULL,
  `question_option3` varchar(50) NOT NULL,
  PRIMARY KEY (`question_id`),
  KEY `fk_examid` (`exam_id`)
) ENGINE=InnoDB AUTO_INCREMENT=312 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exam_question`
--

INSERT INTO `exam_question` (`question_id`, `exam_id`, `exam_question`, `question_answer`, `question_option1`, `question_option2`, `question_option3`) VALUES
(1, 1, 'Which scientist is known for the theory of relativity?', 'Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Nikola Tesla'),
(2, 1, 'What is the chemical symbol for silver?', 'Ag', 'Au', 'Hg', 'Fe'),
(3, 1, 'Who wrote the novel \"To Kill a Mockingbird\"?', 'Harper Lee', 'J.K. Rowling', 'J.K. Rowling', 'Ernest Hemingway'),
(4, 1, 'What is the capital city of Australia?', 'Canberra', 'Sydney', 'Melbourne', 'Perth');

-- --------------------------------------------------------

--
-- Table structure for table `exam_result`
--

DROP TABLE IF EXISTS `exam_result`;
CREATE TABLE IF NOT EXISTS `exam_result` (
  `exam_id` int NOT NULL,
  `student_id` int NOT NULL,
  `exam_score` int NOT NULL,
  PRIMARY KEY (`student_id`,`exam_id`),
  KEY `fk_studentid` (`student_id`),
  KEY `fk_examresult` (`exam_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exam_result`
--

INSERT INTO `exam_result` (`exam_id`, `student_id`, `exam_score`) VALUES
(1, 1, 0),
(1, 3, 50);

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE IF NOT EXISTS `feedback` (
  `feedback_id` int NOT NULL AUTO_INCREMENT,
  `feedback_title` varchar(255) NOT NULL,
  `sender_name` varchar(50) NOT NULL,
  `sender_email` varchar(50) NOT NULL,
  `feedback_content` text NOT NULL,
  `feedback_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `feedback_status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`feedback_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`feedback_id`, `feedback_title`, `sender_name`, `sender_email`, `feedback_content`, `feedback_date`, `feedback_status`) VALUES
(9, 'Assistant College Admissions Counselor', 'Soh Zhe Hong', 'sohzhehong09@gmail.com', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque faucibus eu lorem vitae gravida. Nullam pellentesque sem sed felis eleifend interdum. Maecenas dignissim consequat felis volutpat mollis. Sed pulvinar fringilla eros eget rhoncus. Sed eget porta augue. Aenean in quam at sem pellentesque semper. Nunc volutpat accumsan est, interdum lacinia.', '2023-05-07 00:10:56', 1),
(10, 'Please help fix the exam issue', 'Soh Zhe Hong', 'sohzhehong09@gmail.com', '\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consectetur eros egestas, facilisis nunc at, maximus nulla. Proin eget lacus non elit bibendum pellentesque ac id eros. Nam elementum facilisis feugiat. Maecenas nec augue efficitur, iaculis eros vel, mollis lacus. Donec vel urna viverra', '2023-05-17 15:27:52', 0),
(11, 'Can\'t Login into Account', 'Zhe Hong', 'zhehong@gmail.com', 'I just registered and I can\'t enter my account with my login credentials', '2023-05-21 12:11:09', 1);

-- --------------------------------------------------------

--
-- Table structure for table `flashcard`
--

DROP TABLE IF EXISTS `flashcard`;
CREATE TABLE IF NOT EXISTS `flashcard` (
  `flashcard_id` int NOT NULL AUTO_INCREMENT,
  `chapter_id` int DEFAULT NULL,
  `flashcard_title` varchar(50) DEFAULT NULL,
  `flashcard_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`flashcard_id`),
  KEY `chapter_id` (`chapter_id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flashcard`
--

INSERT INTO `flashcard` (`flashcard_id`, `chapter_id`, `flashcard_title`, `flashcard_description`) VALUES
(1, 1, 'What is Java?', 'Java is a widely used object-oriented programming language and software platform that runs on billions of devices'),
(3, 1, 'What is Java?', 'Java is a widely used object-oriented programming language'),
(8, 3, 'What is C++?', 'C++ is an object-oriented programming language which gives a clear structure to programs and allows code to be reused, lowering development costs. C++ is portable and can be used to develop applications that can be adapted to multiple platforms.');

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
CREATE TABLE IF NOT EXISTS `quiz` (
  `quiz_id` int NOT NULL AUTO_INCREMENT,
  `chapter_id` int NOT NULL,
  `quiz_question` varchar(255) NOT NULL,
  `quiz_answer` varchar(50) NOT NULL,
  `quiz_option1` varchar(50) NOT NULL,
  `quiz_option2` varchar(50) NOT NULL,
  `quiz_option3` varchar(50) NOT NULL,
  PRIMARY KEY (`quiz_id`),
  KEY `chapter_id` (`chapter_id`)
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz`
--

INSERT INTO `quiz` (`quiz_id`, `chapter_id`, `quiz_question`, `quiz_answer`, `quiz_option1`, `quiz_option2`, `quiz_option3`) VALUES
(1, 3, 'What is the biology term for heart attack?', 'Myocardial Infarction', 'Diabetes', 'Angina', 'Asthma');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
CREATE TABLE IF NOT EXISTS `student` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `student_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Student',
  `student_age` int DEFAULT NULL,
  `student_email` varchar(255) DEFAULT NULL,
  `student_admission` varchar(255) DEFAULT NULL,
  `student_phone` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `student_name`, `student_age`, `student_email`, `student_admission`, `student_phone`) VALUES
(1, 'Wong Jun Shen', 20, 'wongjunshen@apu.edu.my', 'APU', NULL),
(2, 'Sean Hoe Kai Zhe', 20, 'seanhoekaizher@apu.edu.my', 'APU', NULL),
(3, 'Ah Wong', 18, 'seanhoekaizher@apu.edu.my', 'APU', NULL),
(6, 'Danny', NULL, 'danny@gmail.com', NULL, NULL),
(7, 'sckaks', NULL, 'sckaks@gmail.com', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
CREATE TABLE IF NOT EXISTS `teacher` (
  `teacher_id` int NOT NULL AUTO_INCREMENT,
  `teacher_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Teacher',
  `teacher_age` int DEFAULT NULL,
  `teacher_email` varchar(255) DEFAULT NULL,
  `teacher_workplace` varchar(255) DEFAULT NULL,
  `teacher_phone` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`teacher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacher`
--

INSERT INTO `teacher` (`teacher_id`, `teacher_name`, `teacher_age`, `teacher_email`, `teacher_workplace`, `teacher_phone`) VALUES
(1, 'Ong Boon Puah', 40, 'ongong@apu.edu.my', 'APU', '+60733344141'),
(2, 'Ah Tau', 30, 'ahtau@gmail.com', 'IMU', '+60633994841'),
(6, 'Ah ABUABU', 30, 'ahtau@gmail.com', 'IMU', '+60633994841'),
(7, '123', NULL, '123@gmail.com', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `admin_id` int DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `user_password` varchar(50) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_type` varchar(20) NOT NULL,
  `user_profile` varchar(255) DEFAULT NULL,
  `registered_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`user_id`),
  KEY `student_id` (`student_id`),
  KEY `teacher_id` (`teacher_id`),
  KEY `admin_id` (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `student_id`, `teacher_id`, `admin_id`, `username`, `user_password`, `user_email`, `user_type`, `user_profile`, `registered_date`, `user_status`) VALUES
(1, 1, NULL, NULL, 'Blaz', 'blaze123', 'blaze123@gmail.com', 'Student', 'Bronze.png', '2023-04-05 23:31:04', 1),
(3, 2, NULL, NULL, 'Hirokai', 'hirokai123', 'hirokai@gmail.com', 'Student', NULL, '2023-04-16 00:00:00', 1),
(5, NULL, NULL, 1, 'willsmith213', 'willsmith@123', 'willsmith@gmail.com', 'Admin', NULL, '2023-04-09 19:56:04', 1),
(8, NULL, NULL, 2, 'smithsmith1', 'smithwill123', 'smithwill@gmail.com', 'Admin', NULL, '2023-04-16 19:57:00', 1),
(10, NULL, NULL, 3, 'abuabu', 'abu12345', 'abubakar@gmail.com', 'Admin', NULL, '2023-04-16 19:57:45', 1),
(11, NULL, 1, NULL, 'puahboon', 'ongboon', 'ongboon@gmail.com', 'Teacher', 'Gold.png', '2023-04-16 19:58:39', 1),
(12, NULL, 2, NULL, 'toutou', 'ahtauobfs', 'ahtau@gmail.com', 'Teacher', NULL, '2023-04-16 19:58:39', 1),
(13, NULL, NULL, 4, 'Admin213', 'admin12345', 'newadmin@gmail.com', 'Admin', NULL, '2023-04-19 09:37:44', 1),
(15, 3, NULL, NULL, 'wongwong', 'wong123', 'ahwong@gmail.com', 'Student', NULL, '2023-04-16 00:00:00', 1),
(18, NULL, 6, NULL, 'asda', 'adad', 'ahtqasdsadau@gmail.com', 'Teacher', NULL, '2023-04-16 19:58:39', 1),
(21, 6, NULL, NULL, 'Danny', 'danny', 'danny@gmail.com', 'Student', NULL, '2023-05-13 08:45:48', 1),
(22, NULL, 7, NULL, '1234', '123', '123@gmail.com', 'Teacher', NULL, '2023-05-13 08:48:38', 1),
(23, 7, NULL, NULL, 'sckaks', '1Aaqwerty', 'sckaks@gmail.com', 'Student', NULL, '2023-05-21 15:10:28', 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chapter`
--
ALTER TABLE `chapter`
  ADD CONSTRAINT `chapter_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `chapter_progress`
--
ALTER TABLE `chapter_progress`
  ADD CONSTRAINT `chapter_progress_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapter` (`chapter_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `chapter_progress_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `class`
--
ALTER TABLE `class`
  ADD CONSTRAINT `class_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `class_upload`
--
ALTER TABLE `class_upload`
  ADD CONSTRAINT `class_upload_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD CONSTRAINT `enrollment_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollment_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`) ON DELETE CASCADE;

--
-- Constraints for table `exam`
--
ALTER TABLE `exam`
  ADD CONSTRAINT `exam_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `exam_question`
--
ALTER TABLE `exam_question`
  ADD CONSTRAINT `exam_question_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `exam_result`
--
ALTER TABLE `exam_result`
  ADD CONSTRAINT `exam_result_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `exam_result_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `flashcard`
--
ALTER TABLE `flashcard`
  ADD CONSTRAINT `flashcard_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapter` (`chapter_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `quiz`
--
ALTER TABLE `quiz`
  ADD CONSTRAINT `quiz_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapter` (`chapter_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_ibfk_3` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`) ON DELETE CASCADE ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
