export const getYears = (wave) => {
	switch (wave) {
		case '6': return ['2014', '2013', '2012', '2011', '2010']
		case '5': return ['2009', '2008', '2007', '2006', '2005']
		case '4': return ['2004', '2003', '2002', '2001', '2000', '1999']
		case '3': return ['1998', '1997', '1996', '1995']
		case '2': return ['1994', '1993', '1992', '1991', '1990']
		case '1': return ['1984', '1983', '1982', '1981']
		default: return null
	}
}
