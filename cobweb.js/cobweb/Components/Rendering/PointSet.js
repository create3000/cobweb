
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DLineGeometryNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Color4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DLineGeometryNode,
          X3DCast,
          X3DConstants,
          Color4)
{
"use strict";

	function PointSet (executionContext)
	{
		X3DLineGeometryNode .call (this, executionContext);

		this .addType (X3DConstants .PointSet);

		this .attribNodes  = [ ];
		this .colorNode    = null;
		this .coordNode    = null;
		this .transparent_ = true;
	}

	PointSet .prototype = $.extend (Object .create (X3DLineGeometryNode .prototype),
	{
		constructor: PointSet,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "attrib",   new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "fogCoord", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "color",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "coord",    new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "PointSet";
		},
		getComponentName: function ()
		{
			return "Rendering";
		},
		getContainerField: function ()
		{
			return "geometry";
		},
		initialize: function ()
		{
			X3DLineGeometryNode .prototype .initialize .call (this);

			this .attrib_ .addInterest (this, "set_attrib__");
			this .color_  .addInterest (this, "set_color__");
			this .coord_  .addInterest (this, "set_coord__");

			var browser = this .getBrowser ();

			this .setShader (browser .getPointShader ());
			this .setPrimitiveMode (browser .getContext () .POINTS);
			this .setSolid (false);

			this .set_attrib__ ();
			this .set_color__ ();
			this .set_coord__ ();
		},
		set_attrib__: function ()
		{
			for (var i = 0; i < this .attribNodes .length; ++ i)
				this .attribNodes [i] .removeInterest (this, "addNodeEvent");

			this .attribNodes .length = 0;

			for (var i = 0, length = this .attrib_ .length; i < length; ++ i)
			{
				var attribNode = X3DCast (X3DConstants .X3DVertexAttributeNode, this .attrib_ [i]);

				if (attribNode)
					this .attribNodes .push (attribNode);
			}

			for (var i = 0; i < this .attribNodes .length; ++ i)
				this .attribNodes [i] .addInterest (this, "addNodeEvent");
		},
		set_color__: function ()
		{
			if (this .colorNode)
				this .colorNode .removeInterest (this, "addNodeEvent");

			this .colorNode = X3DCast (X3DConstants .X3DColorNode, this .color_);

			if (this .colorNode)
				this .colorNode .addInterest (this, "addNodeEvent");
		},
		set_coord__: function ()
		{
			if (this .coordNode)
				this .coordNode .removeInterest (this, "addNodeEvent");

			this .coordNode = X3DCast (X3DConstants .X3DCoordinateNode, this .coord_);

			if (this .coordNode)
				this .coordNode .addInterest (this, "addNodeEvent");
		},
		build: function ()
		{
			if (! this .coordNode || this .coordNode .isEmpty ())
				return;

			var
				colorNode = this .colorNode,
				coordNode = this .coordNode;

			//for (size_t a = 0, size = attribNodes .size (); a < size; ++ a)
			//{
			//	attribArrays [a] .reserve (coordNode -> getSize ());

			//	for (size_t i = 0, size = coordNode -> getSize (); i < size; ++ i)
			//		attribNodes [a] -> addValue (attribArrays [a], i);
			//}
			
			if (this .colorNode)
			{
				for (var i = 0, length = coordNode .point_ .length; i < length; ++ i)
					this .addColor (colorNode .get1Color (i));
			}

			for (var i = 0, length = coordNode .point_ .length; i < length; ++ i)
				this .addVertex (coordNode .get1Point (i));

			//this .setAttribs (this .attribNodes, attribArrays);
		},
	});

	return PointSet;
});
