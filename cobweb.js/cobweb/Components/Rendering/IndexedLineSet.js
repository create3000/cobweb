
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DCast,
          X3DConstants)
{
"use strict";

	function IndexedLineSet (executionContext)
	{
		X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .IndexedLineSet);

		this .attribNodes  = [ ];
		this .colorNode    = null;
		this .coordNode    = null;
	}

	IndexedLineSet .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
	{
		constructor: IndexedLineSet,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "colorPerVertex", new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "colorIndex",     new Fields .MFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "coordIndex",     new Fields .MFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "attrib",         new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "fogCoord",       new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "color",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "coord",          new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "IndexedLineSet";
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
			X3DGeometryNode .prototype .initialize .call (this);

			this .attrib_ .addInterest (this, "set_attrib__");
			this .color_  .addInterest (this, "set_color__");
			this .coord_  .addInterest (this, "set_coord__");

			this .setPrimitiveMode (this .getBrowser () .getContext () .LINES);
			
			this .set_attrib__ ();
			this .set_color__ ();
			this .set_coord__ ();
		},
		isLineGeometry: function ()
		{
			return true;
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
		getColorPerVertexIndex: function (index)
		{
			if (index < this .colorIndex_ .length)
				return this .colorIndex_ [index];

			return this .coordIndex_ [index];
		},
		getColorIndex: function (index)
		{
			if (index < this .colorIndex_ .length)
				return this .colorIndex_ [index];

			return index;
		},
		getPolylineIndices: function ()
		{
			var
				coordIndex = this .coordIndex_. getValue (),
				polylines  = [ ],
				polyline   = [ ];

			if (this .coordIndex_ .length)
			{
				var i = 0;

				for (var i = 0; i < coordIndex .length; ++ i)
				{
					var index = coordIndex [i] .getValue ();

					if (index >= 0)
						// Add vertex.
						polyline .push (i);

					else
					{
						// Negativ index.

						if (polyline .length > 1)
						{
							// Add polylines.
							polylines .push (polyline);
						}

						polyline = [ ];
					}
				}

				if (coordIndex [coordIndex .length - 1] .getValue () >= 0)
				{
					if (polyline .length > 1)
						polylines .push (polyline);
				}
			}

			return polylines;
		},
		build: function ()
		{
			if (! this .coordNode || this .coordNode .isEmpty ())
				return;

			var
				coordIndex     = this .coordIndex_. getValue (),
				polylines      = this .getPolylineIndices (),
				colorPerVertex = this .colorPerVertex_ .getValue (),
				attribArrays   = [ ];

			// Fill GeometryNode

			var face = 0;

			for (var p = 0; p < polylines .length; ++ p)
			{
				var polyline = polylines [p];
			
				// Create two vertices for each line.

				for (var line = 0, l_end = polyline .length - 1; line < l_end; ++ line)
				{
					for (var index = line, i_end = line + 2; index < i_end; ++ index)
					{
						var i = polyline [index];

						//for (size_t a = 0, size = attribNodes .size (); a < size; ++ a)
						//	attribNodes [a] -> addValue (attribArrays [a], coordIndex () [i]);

						if (this .colorNode)
						{
							if (colorPerVertex)
								this .addColor (this .colorNode .getColor (this .getColorPerVertexIndex (i)));
							else
								this .addColor (this .colorNode .getColor (this .getColorIndex (face)));
						}

						this .addVertex (this .coordNode .getPoint (coordIndex [i] .getValue ()));
					}
				}

				++ face;
			}

			this .setSolid (false);
			//this .setAttribs (this .attribNodes, attribArrays);
		},
		traverse: function (context)
		{
			var browser = this .getBrowser ();

			if (browser .getShader () === browser .getDefaultShader ())
			{
				browser .setTexture (null);
				browser .setShader (browser .getLineShader ());
			}

			X3DGeometryNode .prototype .traverse .call (this, context);
		},
	});

	return IndexedLineSet;
});


