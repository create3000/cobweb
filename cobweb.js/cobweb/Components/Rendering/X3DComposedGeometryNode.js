
define ([
	"jquery",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/x3d_cast",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DGeometryNode,
          x3d_cast,
          X3DConstants)
{
	function X3DComposedGeometryNode (browser, executionContext)
	{
		X3DGeometryNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DComposedGeometryNode);

		this .transparent  = false;
		this .attribNodes  = [ ];
		this .colorNode    = null;
		this .texCoordNode = null;
		this .normalNode   = null;
		this .coordNode    = null;
	}

	X3DComposedGeometryNode .prototype = $.extend (new X3DGeometryNode (),
	{
		constructor: X3DComposedGeometryNode,
		initialize: function ()
		{
			X3DGeometryNode .prototype .initialize .call (this);

			//this .attrib_   .addInterest (this, "set_attrib__");
			//this .color_    .addInterest (this, "set_color__");
			//this .texCoord_ .addInterest (this, "set_texCoord__");
			this .normal_   .addInterest (this, "set_normal__");
			this .coord_    .addInterest (this, "set_coord__");

			//this .set_attrib__ ();
			//this .set_color__ ();
			//this .set_texCoord__ ();
			this .set_normal__ ();
			this .set_coord__ ();
		},
		isTransparent: function ()
		{
			return this .transparent;
		},
		getAttrib: function ()
		{
			return this .attribNodes;
		},
		getColor: function ()
		{
			return this .colorNode;
		},
		getTexCoord: function ()
		{
			return this .texCoordNode;
		},
		getNormal: function ()
		{
			return this .normalNode;
		},
		getCoord: function ()
		{
			return this .coordNode;
		},
		set_normal__: function ()
		{
			//if (this .normalNode)
			//	this .normalNode .removeInterest (this);

			this .normalNode = x3d_cast (X3DConstants .X3DNormalNode, this .normal_);

			//if (this .normalNode)
			//	this .normalNode .addInterest (this);
		},
		set_coord__: function ()
		{
			//if (this .coordNode)
			//	this .coordNode .removeInterest (this);

			this .coordNode = x3d_cast (X3DConstants .X3DCoordinateNode, this .coord_);

			//if (this .coordNode)
			//	this .coordNode .addInterest (this);
		},
	});

	return X3DComposedGeometryNode;
});

