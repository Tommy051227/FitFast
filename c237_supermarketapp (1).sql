-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 15, 2024 at 10:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `c237_supermarketapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `meallogs`
--

CREATE TABLE `meallogs` (
  `mealId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `userId` int(11) NOT NULL,
  `date` date NOT NULL,
  `calories` int(11) DEFAULT NULL,
  `protein` int(11) DEFAULT NULL,
  `carbs` int(11) DEFAULT NULL,
  `fat` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `meallogs`
--

INSERT INTO `meallogs` (`mealId`, `name`, `userId`, `date`, `calories`, `protein`, `carbs`, `fat`) VALUES
(3, 'salad', 1, '2024-07-15', 50, 0, 12, 0),
(5, 'peach', 2, '2024-07-25', 50, 0, 12, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `name`, `email`, `password`, `phone`, `address`, `image`) VALUES
(1, 'Tommy aaa', '23013093@myrp.edu.sg', '432', '83988515', '456a sengkang west road 13-318', '1721029353353.jpg'),
(2, 'MR JIMMY', 'jimmy123@gmail.com', '1234', '22222222', '456a sengkang west road 13-318', '1721029528016.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `workoutlogs`
--

CREATE TABLE `workoutlogs` (
  `workoutId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `planId` int(11) NOT NULL,
  `date` date NOT NULL,
  `sets` int(11) DEFAULT NULL,
  `reps` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `workoutplans`
--

CREATE TABLE `workoutplans` (
  `planId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `difficultyLevel` varchar(50) NOT NULL,
  `duration` int(11) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `workoutplans`
--

INSERT INTO `workoutplans` (`planId`, `name`, `difficultyLevel`, `duration`, `description`) VALUES
(2, 'squats', 'hard', 10, '200kg'),
(3, 'dumbell press', 'hard', 10, 'nice');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `meallogs`
--
ALTER TABLE `meallogs`
  ADD PRIMARY KEY (`mealId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- Indexes for table `workoutlogs`
--
ALTER TABLE `workoutlogs`
  ADD PRIMARY KEY (`workoutId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `planId` (`planId`);

--
-- Indexes for table `workoutplans`
--
ALTER TABLE `workoutplans`
  ADD PRIMARY KEY (`planId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `meallogs`
--
ALTER TABLE `meallogs`
  MODIFY `mealId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `workoutlogs`
--
ALTER TABLE `workoutlogs`
  MODIFY `workoutId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `workoutplans`
--
ALTER TABLE `workoutplans`
  MODIFY `planId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `meallogs`
--
ALTER TABLE `meallogs`
  ADD CONSTRAINT `meallogs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

--
-- Constraints for table `workoutlogs`
--
ALTER TABLE `workoutlogs`
  ADD CONSTRAINT `workoutlogs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `workoutlogs_ibfk_2` FOREIGN KEY (`planId`) REFERENCES `workoutplans` (`planId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
