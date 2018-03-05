USE [master]
GO
/****** Object:  Database [visorMapa]    Script Date: 5/03/2018 3:59:41 p.m. ******/
CREATE DATABASE [visorMapa]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'visorMapa', FILENAME = N'D:\MSSQL\visorMapa.mdf' , SIZE = 4288KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB ), 
 FILEGROUP [TEMP] 
( NAME = N'TEMPDATOS', FILENAME = N'D:\MSSQL\datos_temp.ndf' , SIZE = 1024KB , MAXSIZE = 20480KB , FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'visorMapa_log', FILENAME = N'D:\MSSQL\visorMapa_log.ldf' , SIZE = 1072KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [visorMapa] SET COMPATIBILITY_LEVEL = 120
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [visorMapa].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [visorMapa] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [visorMapa] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [visorMapa] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [visorMapa] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [visorMapa] SET ARITHABORT OFF 
GO
ALTER DATABASE [visorMapa] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [visorMapa] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [visorMapa] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [visorMapa] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [visorMapa] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [visorMapa] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [visorMapa] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [visorMapa] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [visorMapa] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [visorMapa] SET  DISABLE_BROKER 
GO
ALTER DATABASE [visorMapa] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [visorMapa] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [visorMapa] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [visorMapa] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [visorMapa] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [visorMapa] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [visorMapa] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [visorMapa] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [visorMapa] SET  MULTI_USER 
GO
ALTER DATABASE [visorMapa] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [visorMapa] SET DB_CHAINING OFF 
GO
ALTER DATABASE [visorMapa] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [visorMapa] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
ALTER DATABASE [visorMapa] SET DELAYED_DURABILITY = DISABLED 
GO
USE [visorMapa]
GO
/****** Object:  User [DesarrolladorNew]    Script Date: 5/03/2018 3:59:41 p.m. ******/
CREATE USER [DesarrolladorNew] FOR LOGIN [DesarrolladorNew] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [DesarrolladorNew]
GO
/****** Object:  Table [dbo].[DatosMapa]    Script Date: 5/03/2018 3:59:41 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[DatosMapa](
	[IdMapa] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](50) NOT NULL,
	[Descripcion] [varchar](300) NOT NULL,
	[Lat] [float] NOT NULL,
	[Lng] [float] NOT NULL,
	[Radio] [smallint] NULL CONSTRAINT [DF__datosMapa__Radio__1273C1CD]  DEFAULT ((0)),
	[Direccion] [varchar](max) NOT NULL,
	[Geographic] [geography] NOT NULL,
	[FechaCreacion] [datetime] NOT NULL CONSTRAINT [DF_DatosMapa_FechaCreacion]  DEFAULT (getdate()),
 CONSTRAINT [PK__datosMap__C365155F462B56E7] PRIMARY KEY CLUSTERED 
(
	[IdMapa] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  StoredProcedure [dbo].[EditarMapa]    Script Date: 5/03/2018 3:59:41 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[EditarMapa](@id int,@nombre varchar(50),@descripcion varchar(300),@lat float,@lng float,@radio smallint,@direccion varchar(MAX),@geographic geography  )
AS
UPDATE DatosMapa
SET Nombre = @nombre,
	Descripcion = @descripcion,
	Lat = @lat,
	Lng = @Lng,
	Radio = @radio,
	Direccion = @direccion,
	Geographic = @geographic
WHERE IdMapa=@id
GO
/****** Object:  StoredProcedure [dbo].[EliminarDatosMapa]    Script Date: 5/03/2018 3:59:41 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[EliminarDatosMapa](@Id int)
AS
DELETE FROM DatosMapa
WHERE IdMapa=@Id
GO
/****** Object:  StoredProcedure [dbo].[InsertarMapa]    Script Date: 5/03/2018 3:59:41 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[InsertarMapa](@Nombre varchar(50),@Descripcion varchar(300),@Lat float,@Lng float,@Radio smallint,@Direccion VARCHAR(MAX),@Geographic geography )
AS
BEGIN
	INSERT INTO DatosMapa (Nombre,Descripcion,Lat,Lng,Radio,Direccion,Geographic)
	VALUES(@Nombre,@Descripcion,@Lat,@Lng,@Radio,@Direccion,@Geographic)
END
GO
USE [master]
GO
ALTER DATABASE [visorMapa] SET  READ_WRITE 
GO
