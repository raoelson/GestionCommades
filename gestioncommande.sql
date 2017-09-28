-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Mar 20 Octobre 2015 à 12:47
-- Version du serveur: 5.6.12-log
-- Version de PHP: 5.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `gestioncommande`
--
CREATE DATABASE IF NOT EXISTS `gestioncommande` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `gestioncommande`;

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE IF NOT EXISTS `client` (
  `numclient` varchar(32) NOT NULL,
  `nomclient` varchar(32) NOT NULL,
  PRIMARY KEY (`numclient`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `client`
--

INSERT INTO `client` (`numclient`, `nomclient`) VALUES
('numero1', 'mirana'),
('numero2', 'maoris'),
('numero3', 'dani');

-- --------------------------------------------------------

--
-- Structure de la table `commande`
--

CREATE TABLE IF NOT EXISTS `commande` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numclient` varchar(32) NOT NULL,
  `numproduit` varchar(32) NOT NULL,
  `qtecommande` bigint(20) NOT NULL,
  `datecommande` date NOT NULL,
  `annee` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `numproduit` (`numproduit`),
  KEY `numclient` (`numclient`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

--
-- Contenu de la table `commande`
--

INSERT INTO `commande` (`id`, `numclient`, `numproduit`, `qtecommande`, `datecommande`, `annee`) VALUES
(5, 'numero1', 'p1', 12, '2015-10-18', '2015'),
(6, 'numero1', 'p2', 31, '2015-10-19', '2015'),
(7, 'numero2', 'p1', 11, '2015-10-01', '2015'),
(8, 'numero2', 'p1', 31, '2015-10-06', '2015'),
(10, 'numero1', 'p1', 14, '2015-10-18', '2015'),
(12, 'numero3', 'p1', 6, '2015-10-19', '2015'),
(13, 'numero3', 'p2', 130, '2014-10-19', '2014');

-- --------------------------------------------------------

--
-- Structure de la table `produit`
--

CREATE TABLE IF NOT EXISTS `produit` (
  `numproduit` varchar(32) NOT NULL,
  `designproduit` varchar(32) NOT NULL,
  `puproduit` decimal(10,2) NOT NULL,
  PRIMARY KEY (`numproduit`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `produit`
--

INSERT INTO `produit` (`numproduit`, `designproduit`, `puproduit`) VALUES
('p1', 'riz', '10000.00'),
('p2', 'mais', '15000.00');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(32) NOT NULL,
  `password` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Contenu de la table `user`
--

INSERT INTO `user` (`id`, `login`, `password`) VALUES
(2, 'maoris', 'd594caee6bb4c6221540ee24859f4a26b075725f62c1fa6b673e9e0674b68775'),
(3, 'dani', 'd37c5e7961d0ed500ecf0475346027cf2d7010b7083c411f953936b0e38b1ab2');

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `commande`
--
ALTER TABLE `commande`
  ADD CONSTRAINT `commande_ibfk_1` FOREIGN KEY (`numclient`) REFERENCES `client` (`numclient`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `commande_ibfk_2` FOREIGN KEY (`numproduit`) REFERENCES `produit` (`numproduit`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
