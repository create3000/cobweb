
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Components/Geometry3D/IndexedFaceSet",
	"cobweb/Components/Rendering/Coordinate",
	"cobweb/Components/Texturing/TextureCoordinate",
	"standard/Math/Numbers/Complex",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DBaseNode,
          IndexedFaceSet,
          Coordinate,
          TextureCoordinate,
          Complex,
          Vector2,
          Vector3)
{
	with (Fields)
	{
		function QuadSphereOptions (executionContext)
		{
			X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);
		}

		QuadSphereOptions .prototype = $.extend (new X3DBaseNode (),
		{
			constructor: QuadSphereOptions,
			initialize: function ()
			{
				X3DBaseNode .prototype .initialize .call (this);

				this .addChildren ("uDimension", new SFInt32 (40),
				                   "vDimension", new SFInt32 (20))
			},
			createTexCoordIndex: function ()
			{
				var
					uDimension = this .uDimension_ .getValue (),
					vDimension = this .vDimension_ .getValue (),
					geometry   = this .geometry;

				var p = 0;

				for (var u = 0, uLength = uDimension - 1; u < uLength; ++ u, ++ p)
				{
					geometry .texCoordIndex_ .push (p);
					geometry .texCoordIndex_ .push (p + uDimension - 1);
					geometry .texCoordIndex_ .push (p + uDimension);
					geometry .texCoordIndex_ .push (p);
					geometry .texCoordIndex_ .push (-1);
				}

				for (var v = 1, vLength = vDimension - 2; v < vLength; ++ v, ++ p)
				{
					for (var u = 0, uLength = uDimension - 1; u < uLength; ++ u, ++ p)
					{
						geometry .texCoordIndex_ .push (p);
						geometry .texCoordIndex_ .push (p + uDimension);
						geometry .texCoordIndex_ .push (p + uDimension + 1);
						geometry .texCoordIndex_ .push (p + 1);
						geometry .texCoordIndex_ .push (-1);
					}
				}

				for (var u = 0, uLength = uDimension - 1; u < uLength; ++ u, ++ p)
				{
					geometry .texCoordIndex_ .push (p);
					geometry .texCoordIndex_ .push (p + uDimension);
					geometry .texCoordIndex_ .push (p + uDimension);
					geometry .texCoordIndex_ .push (p + 1);
					geometry .texCoordIndex_ .push (-1);
				}
			},
			createTexCoord: function ()
			{
				var
					uDimension = this .uDimension_ .getValue (),
					vDimension = this .vDimension_ .getValue (),
					texCoord   = this .geometry .texCoord_ .getValue ();

				var polOffset = 1 / (2 * (uDimension - 1));

				for (var u = 0, uLength = uDimension - 1; u < uLength; ++ u)
				{
					var x = u / uLength + polOffset;
					texCoord .point_ .push (new Vector2 (x, 1));
				}

				for (var v = 1, vLength = vDimension - 1; v < vLength; ++ v)
				{
					var y = v / vLength;

					for (var u = 0, uLength = uDimension - 1; u < uLength; ++ u)
					{
						var x = u / uLength;
						texCoord .point_ .push (new Vector2 (x, 1 - y));
					}

					texCoord .point_ .push (new Vector2 (1, 1 - y));
				}

				for (var u = 0, uLength = uDimension - 1; u < uLength; ++ u)
				{
					var x = u / uLength + polOffset;
					texCoord .point_ .push (new Vector2 (x, 0));
				}
			},
			createCoordIndex: function ()
			{
				var
					uDimension = this .uDimension_ .getValue (),
					vDimension = this .vDimension_ .getValue (),
					geometry   = this .geometry;

				for (var p = 0, v = 0, vLength = vDimension - 1; v < vLength; ++ v, ++ p)
				{
					for (var u = 0, uLength = uDimension - 2; u < uLength; ++ u, ++ p)
					{
						geometry .coordIndex_ .push (p);
						geometry .coordIndex_ .push (p + uDimension - 1);
						geometry .coordIndex_ .push (p + uDimension);
						geometry .coordIndex_ .push (p + 1);
						geometry .coordIndex_ .push (-1);
					}

					geometry .coordIndex_ .push (p);
					geometry .coordIndex_ .push (p + uDimension - 1);
					geometry .coordIndex_ .push (p + 1);
					geometry .coordIndex_ .push (p - uDimension + 2);
					geometry .coordIndex_ .push (-1);
				}
			},
			createPoints: function ()
			{
				var
					uDimension = this .uDimension_ .getValue (),
					vDimension = this .vDimension_ .getValue (),
					coord      = this .geometry .coord_ .getValue ();

				// North pole
				for (var u = 0, uLength = uDimension - 1; u < uLength; ++ u)
					coord .point_ .push (new Vector3 (0, 1, 0));

				// Sphere segments
				for (var v = 1, vLength = vDimension - 1; v < vLength; ++ v)
				{
					var zPlane = Complex .Polar (1, -Math .PI * v / vLength);

					for (var u = 0, uLength = uDimension - 1; u < uLength; ++ u)
					{
						var yPlane = Complex .Polar (zPlane .imag, 2 * Math .PI * u / uLength);

						coord .point_ .push (new Vector3 (yPlane .imag, zPlane .real, yPlane .real));
					}
				}

				// South pole
				for (var u = 0, uLength = uDimension - 1; u < uLength; ++ u)
					coord .point_ .push (new Vector3 (0, -1, 0));
			},
			getGeometry: function ()
			{
				if (this .geometry)
					return this .geometry;
	
				this .geometry            = new IndexedFaceSet (this .getExecutionContext ());
				this .geometry .texCoord_ = new TextureCoordinate (this .getExecutionContext ());
				this .geometry .coord_    = new Coordinate (this .getExecutionContext ());

				this .createTexCoordIndex ();
				this .createTexCoord ();
				this .createCoordIndex ();
				this .createPoints ();

				var
					geometry = this .geometry,
					texCoord = this .geometry .texCoord_ .getValue (),
					coord    = this .geometry .coord_ .getValue ();

				geometry .creaseAngle_ = Math .PI;

				texCoord .setup ();
				coord    .setup ();
				geometry .setup ();

				return this .geometry;
			},
		});

		return QuadSphereOptions;
	}
});
