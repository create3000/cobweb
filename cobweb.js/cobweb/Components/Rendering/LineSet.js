
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DLineGeometryNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DLineGeometryNode,
          X3DCast,
          X3DConstants)
{
"use strict";

	function LineSet (executionContext)
	{
		X3DLineGeometryNode .call (this, executionContext);

		this .addType (X3DConstants .LineSet);

		this .attribNodes  = [ ];
		this .colorNode    = null;
		this .coordNode    = null;
	}

	LineSet .prototype = $.extend (Object .create (X3DLineGeometryNode .prototype),
	{
		constructor: LineSet,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "vertexCount", new Fields .MFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "attrib",      new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "fogCoord",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "color",       new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "coord",       new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "LineSet";
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

			this .setPrimitiveMode (this .getBrowser () .getContext () .LINES);
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
			{
				this .colorNode .removeInterest (this, "addNodeEvent");
				this .colorNode .removeInterest (this, "set_transparent__");
			}

			this .colorNode = X3DCast (X3DConstants .X3DColorNode, this .color_);

			if (this .colorNode)
			{
				this .colorNode .addInterest (this, "addNodeEvent");
				this .colorNode .addInterest (this, "set_transparent__");

				this .set_transparent__ ();
			}
			else
				this .transparent_ = false;
		},
		set_transparent__: function ()
		{
			this .transparent_ = this .colorNode .isTransparent ();
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

			// Fill GeometryNode

			var
				vertexCount = this .vertexCount_ .getValue (),
				colorNode   = this .colorNode,
				coordNode   = this .coordNode,
				size        = coordNode .getSize (),
				index       = 0;

			for (var c = 0, length = vertexCount .length; c < length; ++ c)
			{
				var count = vertexCount [c] .getValue ();

				if (index + count > size)
					break;

				if (count > 1)
				{
					count = 2 * count - 2;

					for (var i = 0; i < count; ++ i, index += i & 1)
					{
						//for (size_t a = 0, size = attribNodes .size (); a < size; ++ a)
						//	attribNodes [a] -> addValue (attribArrays [a], index);

						if (colorNode)
							this .addColor (colorNode .getColor (index));

						this .addVertex (coordNode .getPoint (index));
					}

					++ index;
				}
				else
					index += count;
			}

			//this .setAttribs (this .attribNodes, attribArrays);
		},
	});

	return LineSet;
});


