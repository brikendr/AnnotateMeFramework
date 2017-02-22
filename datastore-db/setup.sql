-- MySQL dump 10.13  Distrib 5.7.17, for Linux (x86_64)
--
-- Host: 0.0.0.0    Database: AnnotateMe2
-- ------------------------------------------------------
-- Server version	5.7.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Annotations`
--

DROP TABLE IF EXISTS `Annotations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Annotations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `is_nil` tinyint(1) NOT NULL DEFAULT '0',
  `timespan` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `EntityMentionId` int(11) DEFAULT NULL,
  `ParticipantId` int(11) DEFAULT NULL,
  `CandidateId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `EntityMentionId` (`EntityMentionId`),
  KEY `ParticipantId` (`ParticipantId`),
  KEY `CandidateId` (`CandidateId`),
  CONSTRAINT `Annotations_ibfk_1` FOREIGN KEY (`EntityMentionId`) REFERENCES `EntityMentions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Annotations_ibfk_2` FOREIGN KEY (`ParticipantId`) REFERENCES `Participants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Annotations_ibfk_3` FOREIGN KEY (`CandidateId`) REFERENCES `Candidates` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Candidates`
--

DROP TABLE IF EXISTS `Candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Candidates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `candidate_name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `schema_type` varchar(255) DEFAULT NULL,
  `dbpediaURL` varchar(255) NOT NULL,
  `score` float NOT NULL,
  `rank` int(11) DEFAULT NULL,
  `total_rank` int(11) DEFAULT NULL,
  `is_correct` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `EntityTypeId` int(11) DEFAULT NULL,
  `EntityMentionId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `EntityTypeId` (`EntityTypeId`),
  KEY `EntityMentionId` (`EntityMentionId`),
  CONSTRAINT `Candidates_ibfk_1` FOREIGN KEY (`EntityTypeId`) REFERENCES `EntityTypes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Candidates_ibfk_2` FOREIGN KEY (`EntityMentionId`) REFERENCES `EntityMentions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Collocations`
--

DROP TABLE IF EXISTS `Collocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Collocations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `collocation_json` varchar(255) NOT NULL,
  `pos_json` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `EntityMentionId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `EntityMentionId` (`EntityMentionId`),
  CONSTRAINT `Collocations_ibfk_1` FOREIGN KEY (`EntityMentionId`) REFERENCES `EntityMentions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Documents`
--

DROP TABLE IF EXISTS `Documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `path` varchar(255) NOT NULL,
  `dataset` varchar(45) DEFAULT NULL,
  `total_entries` int(11) DEFAULT '0',
  `total_linked_entities` int(11) DEFAULT '0',
  `total_nil_entities` int(11) DEFAULT '0',
  `total_non_entities` int(11) DEFAULT '0',
  `length_index` int(11) DEFAULT NULL,
  `nr_characters` int(11) DEFAULT NULL,
  `is_resolved` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `EntityMentions`
--

DROP TABLE IF EXISTS `EntityMentions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EntityMentions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `start_index` int(11) DEFAULT NULL,
  `end_index` int(11) DEFAULT NULL,
  `is_resolved` tinyint(1) NOT NULL DEFAULT '0',
  `is_coreferent` tinyint(1) NOT NULL DEFAULT '0',
  `coreferent_entity_id` int(11) DEFAULT NULL,
  `ambiguity_threshold` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `DocumentId` int(11) DEFAULT NULL,
  `EntityTypeId` int(11) DEFAULT NULL,
  `SentanceId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `DocumentId` (`DocumentId`),
  KEY `EntityTypeId` (`EntityTypeId`),
  KEY `SentanceId` (`SentanceId`),
  CONSTRAINT `EntityMentions_ibfk_1` FOREIGN KEY (`DocumentId`) REFERENCES `Documents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `EntityMentions_ibfk_2` FOREIGN KEY (`EntityTypeId`) REFERENCES `EntityTypes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `EntityMentions_ibfk_3` FOREIGN KEY (`SentanceId`) REFERENCES `Sentances` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `EntityTypes`
--

DROP TABLE IF EXISTS `EntityTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EntityTypes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entity_type` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Keywords`
--

DROP TABLE IF EXISTS `Keywords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Keywords` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `DocumentId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `DocumentId` (`DocumentId`),
  CONSTRAINT `Keywords_ibfk_1` FOREIGN KEY (`DocumentId`) REFERENCES `Documents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Participants`
--

DROP TABLE IF EXISTS `Participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Participants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `start_timespan` datetime DEFAULT NULL,
  `end_timespan` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Sentances`
--

DROP TABLE IF EXISTS `Sentances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Sentances` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `start_index` int(11) DEFAULT NULL,
  `end_index` int(11) DEFAULT NULL,
  `tokens` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `DocumentId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `DocumentId` (`DocumentId`),
  CONSTRAINT `Sentances_ibfk_1` FOREIGN KEY (`DocumentId`) REFERENCES `Documents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-02-22 14:08:42
